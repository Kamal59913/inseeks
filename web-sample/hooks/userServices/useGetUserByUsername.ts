import { useQuery } from "@tanstack/react-query";
import userService from "@/lib/api/services/userService";

export const useGetUserByUsername = (username: string, options: any = {}) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await userService.getUserByUsername(username);
      return response?.data;
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!username,
    ...options,
  });
};
