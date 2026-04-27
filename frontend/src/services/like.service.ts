import apiClient from './apiClient';

export type VoteTargetType = 'blogpost' | 'image' | 'video' | 'comment';
export type VoteType = 'upvote' | 'downvote';

export interface VotePayload {
  PostId?: string;
  CommentId?: string;
  type: VoteTargetType;
  voteType?: VoteType;
}

export interface VoteSummary {
  upvotesCount: number;
  downvotesCount: number;
  score: number;
  userVote: VoteType | null;
}

export const likeService = {
  toggleLike: (payload: VotePayload) => apiClient.post('/like/toggle/like', payload),
  getLikeDetails: (payload: VotePayload) => apiClient.post('/like/getlike', payload),
};
