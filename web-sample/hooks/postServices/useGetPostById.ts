import { useQuery } from "@tanstack/react-query";
import postService from "@/lib/api/services/postService";
import { PostResponse } from "@/lib/types/Post";
import { AxiosResponse } from "axios";

export const useGetPostById = (postId: string | number, options: any = {}) => {
  return useQuery<PostResponse | null>({
    queryKey: ["post", String(postId)],
    queryFn: async () => {
      const response = await postService.getPostById(postId);
      if (
        response &&
        "data" in response &&
        (response as AxiosResponse).status === 200
      ) {
        return response.data as PostResponse;
      }
      return null;
    },
    enabled: !!postId,
    ...options,
  });
};
