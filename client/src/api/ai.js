import api from './index.js'

export const aiApi = {
  generateSkillDescription: (data) => api.post('/ai/skill-description', data),
  explainMatch: (data) => api.post('/ai/explain-match', data),
  coachExchange: (data) => api.post('/ai/exchange-coach', data),
  generateBio: (data) => api.post('/ai/generate-bio', data),
}
