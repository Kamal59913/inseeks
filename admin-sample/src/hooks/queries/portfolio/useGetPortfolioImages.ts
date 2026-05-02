import { useQuery } from "@tanstack/react-query";

export const useGetPortfolioImages = (params: any = {}, options: any = {}) => {
  return useQuery({
    queryKey: ["get-portfolio-images", params],
    queryFn: async (): Promise<any> => {
      // Dummy implementation, replace with actual API call if needed
      return {
        data: {
          data: [],
          total: 0,
        },
      };
    },
    ...options,
  });
};

export const useGetPortfolioImagesById = (id: string, options: any = {}) => {
  return useQuery({
    queryKey: ["get-portfolio-image-by-id", id],
    queryFn: async (): Promise<any> => {
      // Dummy implementation
      return {
        data: {
          data: null,
        },
      };
    },
    ...options,
  });
};
