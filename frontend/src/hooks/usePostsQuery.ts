import { useQuery } from '@tanstack/react-query';
import { envService } from '../services/env.service';
import { postService } from '../services/post.service';
import { queryKeys } from './queryKeys';

type FilterType = 'explore' | 'images' | 'videos' | 'blogs';

const homeFetchers = {
  explore: () => postService.getHomePosts(),
  images: () => postService.getHomeImagePosts(),
  videos: () => postService.getHomeVideoPosts(),
  blogs: () => postService.getHomeBlogPosts(),
};

const userFetchers = {
  explore: (username: string) => postService.getUserPosts(username),
  images: (username: string) => postService.getUserImagePosts(username),
  videos: (username: string) => postService.getUserVideoPosts(username),
  blogs: (username: string) => postService.getUserBlogPosts(username),
};

const envFetchers = {
  explore: (envname: string) => envService.getEnvironmentPosts(envname),
  images: (envname: string) => envService.getEnvironmentImagePosts(envname),
  videos: (envname: string) => envService.getEnvironmentVideoPosts(envname),
  blogs: (envname: string) => envService.getEnvironmentBlogPosts(envname),
};

export const useHomePostsQuery = (filter: FilterType) =>
  useQuery({
    queryKey: queryKeys.homePosts(filter),
    queryFn: async () => {
      const response = await homeFetchers[filter]();
      return response.data.done;
    },
  });

export const useUserPostsQuery = (username: string, filter: FilterType, enabled = true) =>
  useQuery({
    queryKey: queryKeys.userPosts(username, filter),
    queryFn: async () => {
      const response = await userFetchers[filter](username);
      return response.data.done;
    },
    enabled: enabled && !!username,
  });

export const useEnvironmentPostsQuery = (envname: string, filter: FilterType, enabled = true) =>
  useQuery({
    queryKey: queryKeys.envPosts(envname, filter),
    queryFn: async () => {
      const response = await envFetchers[filter](envname);
      return response.data.done;
    },
    enabled: enabled && !!envname,
  });
