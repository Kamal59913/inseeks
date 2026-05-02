import apiClient from './apiClient';

export interface CreateBlogPostPayload {
  title: string;
  description: string;
  attachments?: File[];
  envname?: string;
}

export interface CreateImagePostPayload {
  title: string;
  images: File[];
  envname?: string;
}

export interface CreateVideoPostPayload {
  description: string;
  video: File;
  envname?: string;
}

export const postService = {
  getHomePosts: (limit = 5, offset = 0) =>
    apiClient.post('/createpost/getposts/h', { limit, offset }),
  getHomeBlogPosts: (limit = 5, offset = 0) =>
    apiClient.post('/createpost/getposts/h/blogs', { limit, offset }),
  getHomeImagePosts: (limit = 5, offset = 0) =>
    apiClient.post('/createpost/getposts/h/images', { limit, offset }),
  getHomeVideoPosts: (limit = 5, offset = 0) =>
    apiClient.post('/createpost/getposts/h/videos', { limit, offset }),

  getAllPosts: () => apiClient.get('/createpost/getallposts'),
  getImagePosts: () => apiClient.get('/createpost/getallposts/images'),
  getVideoPosts: () => apiClient.get('/createpost/getallposts/videos'),
  getBlogPosts: () => apiClient.get('/createpost/getallposts/blogs'),

  getUserPosts: (username: string, limit = 5, offset = 0) =>
    apiClient.get(`/createpost/getalluserposts/${username}`, { params: { limit, offset } }),
  getUserImagePosts: (username: string, limit = 5, offset = 0) =>
    apiClient.get(`/createpost/getuserposts/images/${username}`, { params: { limit, offset } }),
  getUserVideoPosts: (username: string, limit = 5, offset = 0) =>
    apiClient.get(`/createpost/getuserposts/videos/${username}`, { params: { limit, offset } }),
  getUserBlogPosts: (username: string, limit = 5, offset = 0) =>
    apiClient.get(`/createpost/getuserposts/blogs/${username}`, { params: { limit, offset } }),

  createBlogPost: ({ title, description, attachments = [], envname = '' }: CreateBlogPostPayload) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    attachments.forEach((attachment) => formData.append('attachments', attachment));
    formData.append('envname', envname);
    return apiClient.post('/createpost/generalpost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  createQuestionPost: ({ title, description, attachments = [], envname = '' }: CreateBlogPostPayload) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    attachments.forEach((attachment) => formData.append('attachments', attachment));
    formData.append('envname', envname);
    return apiClient.post('/createpost/generalpost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  createImagePost: ({ title, images, envname = '' }: CreateImagePostPayload) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('envname', envname);
    images.forEach((img) => formData.append('images', img));
    return apiClient.post('/createpost/imagepost', formData);
  },

  createVideoPost: ({ description, video, envname = '' }: CreateVideoPostPayload) => {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('video', video);
    formData.append('envname', envname);
    return apiClient.post('/createpost/videopost', formData);
  },

  likePost: (postId: string) => apiClient.post(`/createpost/like/${postId}`),

  recordView: (postId: string, postType: string) =>
    apiClient.post(`/view/${postId}`, { postType }),

  getPostById: (postId: string) => apiClient.get(`/createpost/getpost/${postId}`),

  deletePost: (postId: string) => apiClient.delete(`/createpost/${postId}`),

  updatePost: (postId: string, data: { title?: string; description?: string }) =>
    apiClient.patch(`/createpost/${postId}`, data),
};
