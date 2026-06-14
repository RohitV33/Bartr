import api from './index.js'

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  verifyEmailOtp: (data) => api.post('/auth/verify-email-otp', data),
  resendVerification: () => api.post('/auth/resend-verification'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

// ── Users ─────────────────────────────────────────────────────────────────────
export const usersApi = {
  search: (params) => api.get('/users', { params }),
  getProfile: (username) => api.get(`/users/${username}`),
  updateProfile: (data) => api.put('/users/me', data),
  updateAvatar: (formData) => api.put('/users/me/avatar', formData),
  getDashboard: () => api.get('/users/me/dashboard'),
  getMatches: () => api.get('/users/me/matches'),
  completeOnboarding: () => api.put('/users/me/onboarding'),
  deactivate: () => api.delete('/users/me'),
}

// ── Skills ────────────────────────────────────────────────────────────────────
export const skillsApi = {
  browse: (params) => api.get('/skills', { params }),
  create: (data) => api.post('/skills', data),
  getCategories: () => api.get('/skills/categories'),
  getMatches: () => api.get('/skills/matches'),
  getSkill: (id) => api.get(`/skills/${id}`),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
  endorse: (id) => api.post(`/skills/${id}/endorse`),
}

// ── Exchanges ─────────────────────────────────────────────────────────────────
export const exchangesApi = {
  list: (params) => api.get('/exchanges', { params }),
  propose: (data) => api.post('/exchanges', data),
  get: (id) => api.get(`/exchanges/${id}`),
  accept: (id) => api.put(`/exchanges/${id}/accept`),
  decline: (id) => api.put(`/exchanges/${id}/decline`),
  complete: (id) => api.put(`/exchanges/${id}/complete`),
  cancel: (id) => api.put(`/exchanges/${id}/cancel`),
  dispute: (id) => api.put(`/exchanges/${id}/dispute`),
  getMessages: (id, params) => api.get(`/exchanges/${id}/messages`, { params }),
  sendMessage: (id, content) => api.post(`/exchanges/${id}/messages`, { content }),
  uploadFile: (id, formData) => api.post(`/exchanges/${id}/files`, formData),
  markMessagesRead: (id) => api.put(`/exchanges/${id}/messages/read`),
}

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewsApi = {
  submit: (data) => api.post('/reviews', data),
  forUser: (userId) => api.get(`/reviews/user/${userId}`),
  forExchange: (exchangeId) => api.get(`/reviews/exchange/${exchangeId}`),
}

// ── Portfolio ─────────────────────────────────────────────────────────────────
export const portfolioApi = {
  forUser: (userId) => api.get(`/portfolio/user/${userId}`),
  create: (formData) => api.post('/portfolio', formData),
  update: (id, data) => api.put(`/portfolio/${id}`, data),
  delete: (id) => api.delete(`/portfolio/${id}`),
}

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationsApi = {
  list: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
}
