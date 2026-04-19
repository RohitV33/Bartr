import axios from 'axios'

export const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || 'https://bartr-backend.onrender.com'
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — redirect to /login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/']
      const isPublic = publicPaths.some(p => window.location.pathname === p || window.location.pathname.startsWith('/#'))
      if (!isPublic) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api