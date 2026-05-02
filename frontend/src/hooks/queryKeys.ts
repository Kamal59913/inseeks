export const queryKeys = {
  currentUser: ['current-user'] as const,
  homePosts: (filter: string) => ['posts', 'home', filter] as const,
  userPosts: (username: string, filter: string) => ['posts', 'user', username, filter] as const,
  envPosts: (envname: string, filter: string) => ['posts', 'env', envname, filter] as const,
  environments: ['environments'] as const,
  suggestedUsers: ['users', 'suggested'] as const,
  followedUsers: ['users', 'followed'] as const,
  unfollowedUsers: ['users', 'unfollowed'] as const,
  profile: (username: string) => ['profile', username] as const,
  comments: (postId: string) => ['comments', postId] as const,
  vote: (type: string, id: string) => ['vote', type, id] as const,
  singlePost: (postId: string) => ['post', postId] as const,
};
