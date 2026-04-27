import apiClient from './apiClient';

export interface CommentPayload {
  Post_Id: string;
  username: string;
  avatar?: string;
  content: string;
  clientTempId?: string;
  attachments?: File[];
}

export interface CommentItem {
  _id: string;
  Post_Id?: string;
  username: string;
  avatar?: string;
  content: string;
  upvotesCount?: number;
  downvotesCount?: number;
  userVote?: 'upvote' | 'downvote' | null;
  createdAt?: string;
  clientTempId?: string | null;
  attachments?: {
    url: string;
    resourceType?: string;
    mimeType?: string;
    originalName?: string;
    bytes?: number;
  }[];
}

export const commentService = {
  getComments: (Post_Id: string) => apiClient.post('/comment/retrieve-comment', { Post_Id }),
  saveComment: (payload: CommentPayload) => {
    const formData = new FormData();
    formData.append('Post_Id', payload.Post_Id);
    formData.append('username', payload.username);
    formData.append('content', payload.content);
    if (payload.avatar) formData.append('avatar', payload.avatar);
    if (payload.clientTempId) formData.append('clientTempId', payload.clientTempId);
    (payload.attachments || []).forEach((attachment) => formData.append('attachments', attachment));

    return apiClient.post('/comment/post-comment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
