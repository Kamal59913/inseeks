import apiClient from './apiClient';

export interface CreateEnvironmentPayload {
  envName: string;
  EnvDescription: string;
  envCoverImage: File;
}

export const envService = {
  getEnvironments: () => apiClient.get('/env/getEnvs'),

  createEnvironment: ({ envName, EnvDescription, envCoverImage }: CreateEnvironmentPayload) => {
    const formData = new FormData();
    formData.append('envName', envName);
    formData.append('EnvDescription', EnvDescription);
    formData.append('envCoverImage', envCoverImage);
    return apiClient.post('/env/create-env', formData);
  },

  setEnvironmentJoin: (title: string, shouldJoin: boolean) =>
    apiClient.post('/env/create-user-join', { title, shouldJoin }),

  getEnvironmentPosts: (envname: string) => apiClient.get(`/env/getposts/env/${envname}`),
  getEnvironmentBlogPosts: (envname: string) => apiClient.get(`/env/getposts/env/blogs/${envname}`),
  getEnvironmentImagePosts: (envname: string) => apiClient.get(`/env/getposts/env/images/${envname}`),
  getEnvironmentVideoPosts: (envname: string) => apiClient.get(`/env/getposts/env/videos/${envname}`),
};
