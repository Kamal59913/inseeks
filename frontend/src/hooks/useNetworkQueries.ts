import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { followService } from '../services/follow.service';
import { userService } from '../services/user.service';
import { flattenInfiniteItems, getNextOffset } from './infiniteQueryUtils';
import { queryKeys } from './queryKeys';
import { PaginatedResponse } from '../types/pagination';

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

export const useSuggestedUsersQuery = (limit = 6) =>
{
  const query = useInfiniteQuery<PaginatedResponse<NetworkUser>>({
    queryKey: [...queryKeys.suggestedUsers, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await userService.getUserList(limit, pageParam as number);
      return response.data.data;
    },
    initialPageParam: 0,
    getNextPageParam: getNextOffset,
  });
  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          items: flattenInfiniteItems(query.data),
        }
      : undefined,
  };
};

export const useFollowedUsersQuery = (limit = 6) =>
{
  const query = useInfiniteQuery<PaginatedResponse<NetworkUser>>({
    queryKey: [...queryKeys.followedUsers, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await followService.getFollowedUsers(limit, pageParam as number);
      return response.data.data;
    },
    initialPageParam: 0,
    getNextPageParam: getNextOffset,
  });
  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          items: flattenInfiniteItems(query.data),
        }
      : undefined,
  };
};

export const useUnfollowedUsersQuery = (limit = 6) =>
{
  const query = useInfiniteQuery<PaginatedResponse<NetworkUser>>({
    queryKey: [...queryKeys.unfollowedUsers, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await followService.getNotFollowedUsers(limit, pageParam as number);
      return response.data.data;
    },
    initialPageParam: 0,
    getNextPageParam: getNextOffset,
  });
  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          items: flattenInfiniteItems(query.data),
        }
      : undefined,
  };
};

export const useToggleFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, shouldFollow }: { userId: string; shouldFollow: boolean }) =>
      followService.setConnection(userId, shouldFollow),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.suggestedUsers }),
        queryClient.invalidateQueries({ queryKey: queryKeys.followedUsers }),
        queryClient.invalidateQueries({ queryKey: queryKeys.unfollowedUsers }),
        queryClient.invalidateQueries({ queryKey: queryKeys.currentUser }),
        queryClient.invalidateQueries({ queryKey: ['profile'] }),
      ]);
    },
  });
};

export const useToggleConnectionMutation = () => {
  return useToggleFollowMutation();
};
