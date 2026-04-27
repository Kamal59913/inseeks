import apiClient from './apiClient';

export const followService = {
  connectUser: (userId: string, toggle: boolean) =>
    apiClient.post('/follow/user/connect', { userId, toggle }),

  toggleConnection: (userId: string, toggle: string) =>
    apiClient.post('/follow/user/connecttoggle', { userId, toggle }),

  setConnection: (userId: string, shouldFollow: boolean) =>
    apiClient.post('/follow/user/connecttoggle', {
      userId,
      toggle: shouldFollow ? 'connected' : 'disconnected',
    }),

  getFollowedUsers: () => apiClient.get('/users/getusers'),
  getNotFollowedUsers: () => apiClient.get('/users/getusersnotfollowed'),
};
