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
  getHomePosts: () => apiClient.post('/createpost/getposts/h'),
  getHomeBlogPosts: () => apiClient.post('/createpost/getposts/h/blogs'),
  getHomeImagePosts: () => apiClient.post('/createpost/getposts/h/images'),
  getHomeVideoPosts: () => apiClient.post('/createpost/getposts/h/videos'),

  getAllPosts: () => apiClient.get('/createpost/getallposts'),
  getImagePosts: () => apiClient.get('/createpost/getallposts/images'),
  getVideoPosts: () => apiClient.get('/createpost/getallposts/videos'),
  getBlogPosts: () => apiClient.get('/createpost/getallposts/blogs'),

  getUserPosts: (username: string) => apiClient.get(`/createpost/getalluserposts/${username}`),
  getUserImagePosts: (username: string) =>
    apiClient.get(`/createpost/getuserposts/images/${username}`),
  getUserVideoPosts: (username: string) =>
    apiClient.get(`/createpost/getuserposts/videos/${username}`),
  getUserBlogPosts: (username: string) =>
    apiClient.get(`/createpost/getuserposts/blogs/${username}`),

  createBlogPost: ({ title, description, attachments = [], envname = '' }: CreateBlogPostPayload) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    attachments.forEach((attachment) => formData.append('attachments', attachment));
    const firstImage = attachments.find((attachment) => attachment.type?.startsWith('image/'));
    if (firstImage) {
      formData.append('image', firstImage);
    }
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
    const firstImage = attachments.find((attachment) => attachment.type?.startsWith('image/'));
    if (firstImage) {
      formData.append('image', firstImage);
    }
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
};
