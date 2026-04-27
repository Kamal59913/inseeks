import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentService, CommentItem } from '../services/comment.service';
import { likeService, VoteSummary } from '../services/like.service';
import { queryKeys } from './queryKeys';

const applyVoteTransition = (
  previous: VoteSummary,
  voteType: 'upvote' | 'downvote',
): VoteSummary => {
  const currentVote = previous.userVote;
  const next = { ...previous };

  if (currentVote === voteType) {
    next.userVote = null;
    if (voteType === 'upvote') next.upvotesCount = Math.max(0, next.upvotesCount - 1);
    if (voteType === 'downvote') next.downvotesCount = Math.max(0, next.downvotesCount - 1);
  } else {
    next.userVote = voteType;
    if (voteType === 'upvote') {
      next.upvotesCount += 1;
      if (currentVote === 'downvote') next.downvotesCount = Math.max(0, next.downvotesCount - 1);
    }
    if (voteType === 'downvote') {
      next.downvotesCount += 1;
      if (currentVote === 'upvote') next.upvotesCount = Math.max(0, next.upvotesCount - 1);
    }
  }

  next.score = next.upvotesCount - next.downvotesCount;
  return next;
};

const updateConversationCountAcrossPosts = (
  queryClient: ReturnType<typeof useQueryClient>,
  postId: string,
  delta: number,
) => {
  queryClient.setQueriesData({ queryKey: ['posts'] }, (previous: any) => {
    if (!Array.isArray(previous)) return previous;

    return previous.map((post) =>
      post?._id === postId
        ? {
            ...post,
            conversationCount: Math.max(0, (post.conversationCount || 0) + delta),
          }
        : post,
    );
  });
};

export const useCommentsQuery = (postId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: async () => {
      const response = await commentService.getComments(postId);
      return response.data.data as CommentItem[];
    },
    enabled: !!postId,
  });

  const createComment = useMutation({
    mutationFn: commentService.saveComment,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.comments(postId) });
      const previous = queryClient.getQueryData<CommentItem[]>(queryKeys.comments(postId)) || [];
      const tempId = payload.clientTempId || `temp-${Date.now()}`;
      const optimisticComment: CommentItem = {
        _id: tempId,
        Post_Id: postId,
        username: payload.username,
        avatar: payload.avatar,
        content: payload.content,
        createdAt: new Date().toISOString(),
        upvotesCount: 0,
        downvotesCount: 0,
        userVote: null,
        clientTempId: tempId,
        attachments: (payload.attachments || []).map((file) => ({
          url: URL.createObjectURL(file),
          mimeType: file.type,
          originalName: file.name,
          bytes: file.size,
          resourceType: file.type?.split('/')[0],
        })),
      };

      queryClient.setQueryData<CommentItem[]>(queryKeys.comments(postId), [
        ...previous,
        optimisticComment,
      ]);
      updateConversationCountAcrossPosts(queryClient, postId, 1);

      return { previous };
    },
    onError: (_error, _payload, context) => {
      queryClient.setQueryData(queryKeys.comments(postId), context?.previous || []);
      updateConversationCountAcrossPosts(queryClient, postId, -1);
    },
    onSuccess: (response, payload) => {
      const savedComment = response.data.data as CommentItem;
      queryClient.setQueryData<CommentItem[]>(queryKeys.comments(postId), (previous = []) =>
        previous.some((comment) => comment._id === (payload.clientTempId || ''))
          ? previous.map((comment) =>
              comment._id === payload.clientTempId ? savedComment : comment,
            )
          : previous.some((comment) => comment._id === savedComment._id)
            ? previous
            : [...previous, savedComment],
      );
    },
  });

  const voteComment = useMutation({
    mutationFn: ({
      commentId,
      voteType,
    }: {
      commentId: string;
      voteType: 'upvote' | 'downvote';
    }) =>
      likeService.toggleLike({
        CommentId: commentId,
        type: 'comment',
        voteType,
      }),
    onMutate: async ({ commentId, voteType }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.comments(postId) });
      const previous = queryClient.getQueryData<CommentItem[]>(queryKeys.comments(postId)) || [];

      queryClient.setQueryData<CommentItem[]>(queryKeys.comments(postId), (comments = []) =>
        comments.map((comment) => {
          if (comment._id !== commentId) return comment;
          const summary = applyVoteTransition(
            {
              upvotesCount: comment.upvotesCount || 0,
              downvotesCount: comment.downvotesCount || 0,
              score: (comment.upvotesCount || 0) - (comment.downvotesCount || 0),
              userVote: comment.userVote || null,
            },
            voteType,
          );
          return { ...comment, ...summary };
        }),
      );

      return { previous };
    },
    onError: (_error, _payload, context) => {
      queryClient.setQueryData(queryKeys.comments(postId), context?.previous || []);
    },
    onSuccess: (response, variables) => {
      const summary = response.data.data as VoteSummary;
      queryClient.setQueryData<CommentItem[]>(queryKeys.comments(postId), (comments = []) =>
        comments.map((comment) =>
          comment._id === variables.commentId ? { ...comment, ...summary } : comment,
        ),
      );
    },
  });

  return {
    ...query,
    comments: query.data || [],
    createComment,
    voteComment,
  };
};
