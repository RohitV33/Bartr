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

// Request interceptor — attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bartr_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle 401 and save tokens
api.interceptors.response.use(
  (res) => {
    // If response contains a token, save it
    if (res.data?.data?.token) {
      localStorage.setItem('bartr_token', res.data.data.token)
    }
    return res
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bartr_token')
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