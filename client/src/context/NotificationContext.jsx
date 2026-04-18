import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSocket } from './SocketContext.jsx'
import { useAuth } from './AuthContext.jsx'
import { QUERY_KEYS } from '../store/queryClient.js'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const qc = useQueryClient()
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    if (!socket || !user) return

    const handler = (notification) => {
      // Invalidate notifications query so the badge updates
      qc.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS({}) })
      // Show toast
      const id = Date.now()
      setToasts(prev => [...prev, { id, ...notification }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
    }

    socket.on('notification:new', handler)
    return () => socket.off('notification:new', handler)
  }, [socket, user, qc])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ toasts, dismissToast }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
