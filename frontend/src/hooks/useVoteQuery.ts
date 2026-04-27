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

export const useVoteQuery = (type: VoteTargetType, id: string) => {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.vote(type, id);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await likeService.getLikeDetails({
        type,
        ...(type === 'comment' ? { CommentId: id } : { PostId: id }),
      });
      return response.data.data as VoteSummary;
    },
    enabled: !!id,
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
      const previous = queryClient.getQueryData<VoteSummary>(queryKey) || defaultSummary;
      queryClient.setQueryData(queryKey, applyVoteTransition(previous, voteType));
      return { previous };
    },
    onError: (_error, _voteType, context) => {
      queryClient.setQueryData(queryKey, context?.previous || defaultSummary);
    },
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response.data.data as VoteSummary);
    },
  });

  return {
    summary: query.data || defaultSummary,
    isLoading: query.isLoading,
    vote: mutation.mutate,
    isVoting: mutation.isPending,
  };
};
