import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followService } from '../services/follow.service';
import { userService } from '../services/user.service';
import { queryKeys } from './queryKeys';

type NetworkUser = {
  _id: string;
  isFollowing?: boolean;
  isFollowed?: boolean;
  followersCount?: number;
  about?: string;
  avatar?: string;
  fullname?: string;
  username?: string;
};

const removeUserFromList = (users: NetworkUser[] | undefined, userId: string) =>
  (users || []).filter((user) => user._id !== userId);

const prependUniqueUser = (
  users: NetworkUser[] | undefined,
  nextUser: NetworkUser | undefined,
  limit?: number,
) => {
  if (!nextUser) return users || [];

  const nextList = [nextUser, ...(users || []).filter((user) => user._id !== nextUser._id)];
  return typeof limit === 'number' ? nextList.slice(0, limit) : nextList;
};

const updateUserFollowState = (user: NetworkUser, shouldFollow: boolean): NetworkUser => ({
  ...user,
  isFollowing: shouldFollow,
  isFollowed: shouldFollow,
  followersCount:
    typeof user.followersCount === 'number'
      ? Math.max(0, user.followersCount + (shouldFollow ? 1 : -1))
      : user.followersCount,
});

export const useSuggestedUsersQuery = () =>
  useQuery({
    queryKey: queryKeys.suggestedUsers,
    queryFn: async () => {
      const response = await userService.getUserList();
      return response.data.data;
    },
  });

export const useFollowedUsersQuery = () =>
  useQuery({
    queryKey: queryKeys.followedUsers,
    queryFn: async () => {
      const response = await followService.getFollowedUsers();
      return response.data.data;
    },
  });

export const useUnfollowedUsersQuery = () =>
  useQuery({
    queryKey: queryKeys.unfollowedUsers,
    queryFn: async () => {
      const response = await followService.getNotFollowedUsers();
      return response.data.data;
    },
  });

export const useToggleFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, shouldFollow }: { userId: string; shouldFollow: boolean }) =>
      followService.setConnection(userId, shouldFollow),
    onMutate: async ({ userId, shouldFollow }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.suggestedUsers }),
        queryClient.cancelQueries({ queryKey: queryKeys.followedUsers }),
        queryClient.cancelQueries({ queryKey: queryKeys.unfollowedUsers }),
      ]);

      const suggestedUsers = queryClient.getQueryData<NetworkUser[]>(queryKeys.suggestedUsers);
      const followedUsers = queryClient.getQueryData<NetworkUser[]>(queryKeys.followedUsers);
      const unfollowedUsers = queryClient.getQueryData<NetworkUser[]>(queryKeys.unfollowedUsers);
      const currentUser = queryClient.getQueryData<any>(queryKeys.currentUser);
      const profileSnapshots = queryClient.getQueriesData({ queryKey: ['profile'] });

      const profileMatch = profileSnapshots
        .map(([, data]) => data as NetworkUser | undefined)
        .find((profile) => profile?._id === userId);

      const sourceUser =
        suggestedUsers?.find((user) => user._id === userId) ||
        followedUsers?.find((user) => user._id === userId) ||
        unfollowedUsers?.find((user) => user._id === userId) ||
        profileMatch;

      const nextUser = sourceUser ? updateUserFollowState(sourceUser, shouldFollow) : undefined;

      queryClient.setQueryData<NetworkUser[]>(
        queryKeys.followedUsers,
        (previous) =>
          shouldFollow
            ? prependUniqueUser(previous, nextUser)
            : removeUserFromList(previous, userId),
      );

      queryClient.setQueryData<NetworkUser[]>(
        queryKeys.unfollowedUsers,
        (previous) =>
          shouldFollow
            ? removeUserFromList(previous, userId)
            : prependUniqueUser(previous, nextUser),
      );

      queryClient.setQueryData<NetworkUser[]>(
        queryKeys.suggestedUsers,
        (previous) =>
          shouldFollow
            ? removeUserFromList(previous, userId)
            : prependUniqueUser(previous, nextUser, 3),
      );

      queryClient.setQueryData(queryKeys.currentUser, (previous: any) => {
        if (!previous) return previous;

        return {
          ...previous,
          channelsFollowedToCount: Math.max(
            0,
            (previous.channelsFollowedToCount || 0) + (shouldFollow ? 1 : -1),
          ),
        };
      });

      profileSnapshots.forEach(([queryKey, profile]) => {
        const currentProfile = profile as any;
        if (!currentProfile || currentProfile._id !== userId) return;

        queryClient.setQueryData(queryKey, {
          ...currentProfile,
          isFollowed: shouldFollow,
          followersCount: Math.max(
            0,
            (currentProfile.followersCount || 0) + (shouldFollow ? 1 : -1),
          ),
        });
      });

      return {
        suggestedUsers,
        followedUsers,
        unfollowedUsers,
        currentUser,
        profileSnapshots,
      };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;

      queryClient.setQueryData(queryKeys.suggestedUsers, context.suggestedUsers);
      queryClient.setQueryData(queryKeys.followedUsers, context.followedUsers);
      queryClient.setQueryData(queryKeys.unfollowedUsers, context.unfollowedUsers);
      queryClient.setQueryData(queryKeys.currentUser, context.currentUser);

      context.profileSnapshots.forEach(([queryKey, profile]) => {
        queryClient.setQueryData(queryKey, profile);
      });
    },
  });
};

export const useToggleConnectionMutation = () => {
  return useToggleFollowMutation();
};
