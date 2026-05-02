import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { envService } from '../services/env.service';
import { flattenInfiniteItems, getNextOffset } from './infiniteQueryUtils';
import { postService } from '../services/post.service';
import { queryKeys } from './queryKeys';
import { PaginatedResponse } from '../types/pagination';

type FilterType = 'explore' | 'images' | 'videos' | 'blogs';

const homeFetchers = {
  explore: (limit: number, offset: number) => postService.getHomePosts(limit, offset),
  images: (limit: number, offset: number) => postService.getHomeImagePosts(limit, offset),
  videos: (limit: number, offset: number) => postService.getHomeVideoPosts(limit, offset),
  blogs: (limit: number, offset: number) => postService.getHomeBlogPosts(limit, offset),
};

const userFetchers = {
  explore: (username: string, limit: number, offset: number) =>
    postService.getUserPosts(username, limit, offset),
  images: (username: string, limit: number, offset: number) =>
    postService.getUserImagePosts(username, limit, offset),
  videos: (username: string, limit: number, offset: number) =>
    postService.getUserVideoPosts(username, limit, offset),
  blogs: (username: string, limit: number, offset: number) =>
    postService.getUserBlogPosts(username, limit, offset),
};

const envFetchers = {
  explore: (envname: string, limit: number, offset: number) =>
    envService.getEnvironmentPosts(envname, limit, offset),
  images: (envname: string, limit: number, offset: number) =>
    envService.getEnvironmentImagePosts(envname, limit, offset),
  videos: (envname: string, limit: number, offset: number) =>
    envService.getEnvironmentVideoPosts(envname, limit, offset),
  blogs: (envname: string, limit: number, offset: number) =>
    envService.getEnvironmentBlogPosts(envname, limit, offset),
};

export const useHomePostsQuery = (filter: FilterType) =>
{
  const query = useInfiniteQuery<PaginatedResponse<any>>({
    queryKey: queryKeys.homePosts(filter),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await homeFetchers[filter](5, pageParam as number);
      return {
        items: response.data.done,
        pagination: response.data.pagination,
      };
    },
    initialPageParam: 0,
    getNextPageParam: getNextOffset,
  });
  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          items: flattenInfiniteItems(query.data),
        }
      : undefined,
  };
};

export const useUserPostsQuery = (username: string, filter: FilterType, enabled = true) =>
{
  const query = useInfiniteQuery<PaginatedResponse<any>>({
    queryKey: queryKeys.userPosts(username, filter),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await userFetchers[filter](username, 5, pageParam as number);
      return {
        items: response.data.done,
        pagination: response.data.pagination,
      };
    },
    initialPageParam: 0,
    getNextPageParam: getNextOffset,
    enabled: enabled && !!username,
  });
  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          items: flattenInfiniteItems(query.data),
        }
      : undefined,
  };
};

export const useEnvironmentPostsQuery = (envname: string, filter: FilterType, enabled = true) =>
{
  const query = useInfiniteQuery<PaginatedResponse<any>>({
    queryKey: queryKeys.envPosts(envname, filter),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await envFetchers[filter](envname, 5, pageParam as number);
      return {
        items: response.data.done,
        pagination: response.data.pagination,
      };
    },
    initialPageParam: 0,
    getNextPageParam: getNextOffset,
    enabled: enabled && !!envname,
  });
  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          items: flattenInfiniteItems(query.data),
        }
      : undefined,
  };
};

export const useSinglePostQuery = (postId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.singlePost(postId),
    queryFn: async () => {
      const response = await postService.getPostById(postId);
      return response.data.data;
    },
    enabled: enabled && !!postId,
  });
};
