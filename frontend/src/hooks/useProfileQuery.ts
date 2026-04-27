import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { queryKeys } from './queryKeys';

export const useProfileQuery = (username: string) =>
  useQuery({
    queryKey: queryKeys.profile(username),
    queryFn: async () => {
      const response = await userService.getProfile(username);
      return response.data.data;
    },
    enabled: !!username,
  });
