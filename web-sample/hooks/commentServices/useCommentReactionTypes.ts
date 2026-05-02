import commentService from "@/lib/api/services/commentService";
import { useQuery } from "@tanstack/react-query";

export const useCommentReactionTypes = (options: any = {}) => {
  return useQuery({
    queryKey: ["comment-reaction-types"],
    queryFn: () => commentService.getCommentReactionTypes(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    ...options,
  });
};
