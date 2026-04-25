import apiClient from './apiClient'

export const postService = {
  // ─── Fetch posts ────────────────────────────────────────────────────────
  /** GET /createpost/getallposts */
  getAllPosts: () => apiClient.get('/createpost/getallposts'),

  /** GET /createpost/getallposts/images */
  getImagePosts: () => apiClient.get('/createpost/getallposts/images'),

  /** GET /createpost/getallposts/videos */
  getVideoPosts: () => apiClient.get('/createpost/getallposts/videos'),

  /** GET /createpost/getallposts/blogs */
  getBlogPosts: () => apiClient.get('/createpost/getallposts/blogs'),

  // ─── User-specific posts ────────────────────────────────────────────────
  /** GET /createpost/getalluserposts/:username */
  getUserPosts: (username) => apiClient.get(`/createpost/getalluserposts/${username}`),

  /** GET /createpost/getuserposts/images/:username */
  getUserImagePosts: (username) => apiClient.get(`/createpost/getuserposts/images/${username}`),

  /** GET /createpost/getuserposts/videos/:username */
  getUserVideoPosts: (username) => apiClient.get(`/createpost/getuserposts/videos/${username}`),

  /** GET /createpost/getuserposts/blogs/:username */
  getUserBlogPosts: (username) => apiClient.get(`/createpost/getuserposts/blogs/${username}`),

  // ─── Create posts ───────────────────────────────────────────────────────
  /**
   * POST /createpost/generalpost
   * @param {{ title?: string, description: string, image: File, envname?: string }} params
   */
  createBlogPost: ({ title, description, image, envname = '' }) => {
    const formData = new FormData()
    formData.append('title', title || '')
    formData.append('description', description)
    formData.append('image', image)
    formData.append('envname', envname)
    return apiClient.post('/createpost/generalpost', formData)
  },

  /**
   * POST /createpost/imagepost
   * @param {{ title: string, images: File[], envname?: string }} params
   */
  createImagePost: ({ title, images, envname = '' }) => {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('envname', envname)
    images.forEach((img) => formData.append('images', img))
    return apiClient.post('/createpost/imagepost', formData)
  },

  /**
   * POST /createpost/videopost
   * @param {{ description: string, video: File, envname?: string }} params
   */
  createVideoPost: ({ description, video, envname = '' }) => {
    const formData = new FormData()
    formData.append('description', description)
    formData.append('video', video)
    formData.append('envname', envname)
    return apiClient.post('/createpost/videopost', formData)
  },

  // ─── Likes ──────────────────────────────────────────────────────────────
  /** POST /createpost/like/:postId */
  likePost: (postId) => apiClient.post(`/createpost/like/${postId}`),
}
