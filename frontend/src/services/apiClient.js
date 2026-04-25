import axios from 'axios'

/**
 * Central Axios instance for Inseeks API.
 * - baseURL reads from env (Vite proxy handles localhost:8000 → no CORS)
 * - withCredentials=true ensures auth cookies are sent on every request
 * - 'multipart/form-data' is omitted from default headers — Axios sets it
 *   automatically with the correct boundary when FormData is passed
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,  // e.g. http://localhost:8000/api/v1
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

// ─── Request interceptor ────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

// ─── Response interceptor ───────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      // Redirect to login if session expired
      window.location.href = '/'
    }
    return Promise.reject(error)
  },
)

export default apiClient
