import communityService from "@/lib/api/services/communityService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useSearchCommunities = (
  search: string,
  limitAvatarPreview: number = 5,
  options?: { enabled?: boolean },
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["search-communities", search, limitAvatarPreview],
    queryFn: ({ signal }) =>
      communityService.searchCommunities(search, limitAvatarPreview, signal),
    staleTime: 30 * 1000, // 30 seconds — search results can change more frequently
    gcTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled:
      options?.enabled !== undefined
        ? options.enabled
        : search.trim().length >= 1,
  });
};
