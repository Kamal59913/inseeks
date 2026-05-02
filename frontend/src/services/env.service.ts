import apiClient from './apiClient';

export interface CreateEnvironmentPayload {
  envName: string;
  EnvDescription: string;
  envCoverImage: File;
}

export const envService = {
  getEnvironments: (limit = 8, offset = 0) =>
    apiClient.get('/env/getEnvs', { params: { limit, offset } }),

  createEnvironment: ({ envName, EnvDescription, envCoverImage }: CreateEnvironmentPayload) => {
    const formData = new FormData();
    formData.append('envName', envName);
    formData.append('EnvDescription', EnvDescription);
    formData.append('envCoverImage', envCoverImage);
    return apiClient.post('/env/create-env', formData);
  },

  setEnvironmentJoin: (title: string, shouldJoin: boolean) =>
    apiClient.post('/env/create-user-join', { title, shouldJoin }),

  getEnvironmentPosts: (envname: string, limit = 5, offset = 0) =>
    apiClient.get(`/env/getposts/env/${envname}`, { params: { limit, offset } }),
  getEnvironmentBlogPosts: (envname: string, limit = 5, offset = 0) =>
    apiClient.get(`/env/getposts/env/blogs/${envname}`, { params: { limit, offset } }),
  getEnvironmentImagePosts: (envname: string, limit = 5, offset = 0) =>
    apiClient.get(`/env/getposts/env/images/${envname}`, { params: { limit, offset } }),
  getEnvironmentVideoPosts: (envname: string, limit = 5, offset = 0) =>
    apiClient.get(`/env/getposts/env/videos/${envname}`, { params: { limit, offset } }),

  deleteEnvironment: (envname: string) =>
    apiClient.delete(`/env/${envname}`),

  updateEnvironment: (envname: string, data: { EnvDescription?: string }) =>
    apiClient.patch(`/env/${envname}`, data),
};
