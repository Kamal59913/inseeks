import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { envService } from '../services/env.service';
import { queryKeys } from './queryKeys';

type EnvironmentItem = {
  _id?: string;
  name: string;
  description?: string;
  envAvatar?: string;
  isJoined?: boolean;
};

export const useEnvironmentQuery = () =>
  useQuery({
    queryKey: queryKeys.environments,
    queryFn: async () => {
      const response = await envService.getEnvironments();
      return response.data.data;
    },
  });

export const useJoinEnvironmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, shouldJoin }: { title: string; shouldJoin: boolean }) =>
      envService.setEnvironmentJoin(title, shouldJoin),
    onMutate: async ({ title, shouldJoin }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.environments });

      const environments = queryClient.getQueryData<EnvironmentItem[]>(queryKeys.environments);

      queryClient.setQueryData<EnvironmentItem[]>(
        queryKeys.environments,
        (previous) =>
          (previous || []).map((environment) =>
            environment.name === title
              ? { ...environment, isJoined: shouldJoin }
              : environment,
          ),
      );

      return { environments };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData(queryKeys.environments, context.environments);
    },
  });
};
