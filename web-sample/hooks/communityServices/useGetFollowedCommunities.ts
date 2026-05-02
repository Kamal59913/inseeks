import communityService from "@/lib/api/services/communityService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetFollowedCommunities = (
  options?: { enabled?: boolean },
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-followed-communities"],
    queryFn: () => communityService.getFollowedCommunities(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};
