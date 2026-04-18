import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export const QUERY_KEYS = {
  // Auth
  ME: ['auth', 'me'],

  // Users
  USER_PROFILE: (username) => ['users', 'profile', username],
  USER_SEARCH: (params) => ['users', 'search', params],
  DASHBOARD: ['users', 'dashboard'],
  MY_MATCHES: ['users', 'matches'],

  // Skills
  SKILLS: (params) => ['skills', params],
  SKILL: (id) => ['skills', id],
  CATEGORIES: ['skills', 'categories'],
  SKILL_MATCHES: ['skills', 'matches'],

  // Exchanges
  EXCHANGES: (params) => ['exchanges', params],
  EXCHANGE: (id) => ['exchanges', id],
  MESSAGES: (exchangeId) => ['exchanges', exchangeId, 'messages'],

  // Reviews
  USER_REVIEWS: (userId) => ['reviews', 'user', userId],
  EXCHANGE_REVIEWS: (exchangeId) => ['reviews', 'exchange', exchangeId],

  // Portfolio
  PORTFOLIO: (userId) => ['portfolio', userId],

  // Notifications
  NOTIFICATIONS: (params) => ['notifications', params],
}
