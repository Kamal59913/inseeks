import communityService from "@/lib/api/services/communityService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetCommunityById = (
  id: string | number,
  avatarPreviewLimit: number = 4,
  options?: { enabled?: boolean },
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-community", id, avatarPreviewLimit],
    queryFn: () => communityService.getCommunityById(id, avatarPreviewLimit),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  });
};
