import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/endpoints.js'
import { QUERY_KEYS } from '../store/queryClient.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const qc = useQueryClient()
  const [ready, setReady] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: () => authApi.me().then(r => r.data.data.user),
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (!isLoading) setReady(true)
  }, [isLoading])

  const user = error ? null : data

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      localStorage.removeItem('bartr_token')
      qc.clear()
      window.location.href = '/'
    }
  }, [qc])

  const refreshUser = useCallback(() => {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.ME })
  }, [qc])

  return (
    <AuthContext.Provider value={{ user, isLoading: !ready, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
