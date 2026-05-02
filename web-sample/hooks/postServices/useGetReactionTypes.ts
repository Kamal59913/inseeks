import { useQuery } from "@tanstack/react-query";
import reactionService from "@/lib/api/services/reactionService";
import { ReactionType } from "@/components/Features/ReactionPicker";

export const useGetReactionTypes = (options: any = {}) => {
  return useQuery<ReactionType[]>({
    queryKey: ["reaction-types"],
    queryFn: async () => {
      const response: any = await reactionService.getReactionTypes();
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour (reaction types rarely change)
    ...options,
  });
};
