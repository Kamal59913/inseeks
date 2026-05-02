import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { likeService, VoteSummary, VoteTargetType, VoteType } from '../services/like.service';
import { queryKeys } from './queryKeys';

const applyVoteTransition = (
  previous: VoteSummary,
  voteType: VoteType,
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
    } else {
      next.downvotesCount += 1;
      if (currentVote === 'upvote') next.upvotesCount = Math.max(0, next.upvotesCount - 1);
    }
  }

  next.score = next.upvotesCount - next.downvotesCount;
  return next;
};

const defaultSummary: VoteSummary = {
  upvotesCount: 0,
  downvotesCount: 0,
  score: 0,
  userVote: null,
};

const updateVoteSummaryAcrossPosts = (
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  summary: VoteSummary,
) => {
  queryClient.setQueriesData({ queryKey: ['posts'] }, (previous: any) => {
    if (!previous?.pages) return previous;

    return {
      ...previous,
      pages: previous.pages.map((page: any) => ({
        ...page,
        items: (page.items || []).map((post: any) =>
          post?._id === id
            ? {
                ...post,
                ...summary,
              }
            : post,
        ),
      })),
    };
  });
};

export const useVoteQuery = (
  type: VoteTargetType,
  id: string,
  initialSummary?: Partial<VoteSummary>,
) => {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.vote(type, id);
  const fallbackSummary = {
    ...defaultSummary,
    ...initialSummary,
    score:
      typeof initialSummary?.score === 'number'
        ? initialSummary.score
        : (initialSummary?.upvotesCount || 0) - (initialSummary?.downvotesCount || 0),
  };

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await likeService.getLikeDetails({
        type,
        ...(type === 'comment' ? { CommentId: id } : { PostId: id }),
      });
      return response.data.data as VoteSummary;
    },
    enabled: !!id && type === 'comment',
    initialData: fallbackSummary,
  });

  const mutation = useMutation({
    mutationFn: (voteType: VoteType) =>
      likeService.toggleLike({
        type,
        voteType,
        ...(type === 'comment' ? { CommentId: id } : { PostId: id }),
      }),
    onMutate: async (voteType) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<VoteSummary>(queryKey) || fallbackSummary;
      const optimistic = applyVoteTransition(previous, voteType);
      queryClient.setQueryData(queryKey, optimistic);
      if (type !== 'comment') {
        updateVoteSummaryAcrossPosts(queryClient, id, optimistic);
      }
      return { previous };
    },
    onError: (_error, _voteType, context) => {
      const restored = context?.previous || fallbackSummary;
      queryClient.setQueryData(queryKey, restored);
      if (type !== 'comment') {
        updateVoteSummaryAcrossPosts(queryClient, id, restored);
      }
    },
    onSuccess: (response) => {
      const nextSummary = response.data.data as VoteSummary;
      queryClient.setQueryData(queryKey, nextSummary);
      if (type !== 'comment') {
        updateVoteSummaryAcrossPosts(queryClient, id, nextSummary);
      }
    },
  });

  return {
    summary: query.data || fallbackSummary,
    isLoading: query.isLoading,
    vote: mutation.mutate,
    isVoting: mutation.isPending,
  };
};
