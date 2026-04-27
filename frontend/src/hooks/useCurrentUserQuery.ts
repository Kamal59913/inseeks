import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService, UpdateAccountPayload } from '../services/user.service';
import { queryKeys } from './queryKeys';

export const useCurrentUserQuery = () =>
  useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: async () => {
      const response = await userService.getCurrentUser();
      return response.data.data;
    },
  });

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAccountPayload) => userService.updateAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
  });
};
