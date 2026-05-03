import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { envService } from '../services/env.service';
import { flattenInfiniteItems, getNextOffset } from './infiniteQueryUtils';
import { queryKeys } from './queryKeys';
import { PaginatedResponse } from '../types/pagination';

type EnvironmentItem = {
  _id?: string;
  name: string;
  description?: string;
  envAvatar?: string;
  isJoined?: boolean;
  CreatedBy?: string;
};

export const useEnvironmentQuery = (limit = 8) =>
{
  const query = useInfiniteQuery<PaginatedResponse<EnvironmentItem>>({
    queryKey: [...queryKeys.environments, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await envService.getEnvironments(limit, pageParam as number);
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

export const useJoinEnvironmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, shouldJoin }: { title: string; shouldJoin: boolean }) =>
      envService.setEnvironmentJoin(title, shouldJoin),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.environments });
    },
  });
};
