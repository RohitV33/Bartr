import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext.jsx'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const socketRef = useRef(null)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setConnected(false)
      }
      return
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://bartr-backend.onrender.com'
    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('user:online', ({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, userId]))
    })

    socket.on('user:offline', ({ userId }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [user?.id])

  const joinExchangeRoom = useCallback((exchangeId) => {
    socketRef.current?.emit('join_exchange_room', exchangeId)
  }, [])

  const leaveExchangeRoom = useCallback((exchangeId) => {
    socketRef.current?.emit('leave_exchange_room', exchangeId)
  }, [])

  const sendMessage = useCallback((exchangeId, content) => {
    socketRef.current?.emit('send_message', { exchangeId, content })
  }, [])

  const emitTypingStart = useCallback((exchangeId) => {
    socketRef.current?.emit('typing_start', { exchangeId })
  }, [])

  const emitTypingStop = useCallback((exchangeId) => {
    socketRef.current?.emit('typing_stop', { exchangeId })
  }, [])

  const isOnline = useCallback((userId) => onlineUsers.has(userId), [onlineUsers])

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      connected,
      onlineUsers,
      isOnline,
      joinExchangeRoom,
      leaveExchangeRoom,
      sendMessage,
      emitTypingStart,
      emitTypingStop,
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used within SocketProvider')
  return ctx
}
