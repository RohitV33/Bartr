import { Server } from 'socket.io'
import { verifyToken } from '../utils/tokenUtils.js'
import prisma from '../config/db.js'
import { getAllowedOrigins } from '../config/cors.js'

// userId → Set of socketIds
const onlineUsers = new Map()

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        const allowed = getAllowedOrigins()
        const sanitizedOrigin = origin.replace(/\/+$/, '')
        if (allowed.includes(sanitizedOrigin) || process.env.NODE_ENV !== 'production') {
          return callback(null, true)
        }
        return callback(new Error('Socket CORS origin not allowed'))
      },
      credentials: true,
    },
  })

  // ── Auth middleware ──────────────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.cookie
        ?.split(';')
        .find(c => c.trim().startsWith('bartr_token='))
        ?.split('=')[1]

      if (!token) return next(new Error('Authentication required'))
      const payload = verifyToken(token)
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, full_name: true, username: true, avatar_url: true },
      })
      if (!user) return next(new Error('User not found'))
      socket.user = user
      next()
    } catch (err) {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.user.id
    console.log(`🔌 Socket connected: ${socket.user.username} (${socket.id})`)

    // Track online presence
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set())
    onlineUsers.get(userId).add(socket.id)
    io.emit('user:online', { userId, full_name: socket.user.full_name })

    // ── Join exchange room ──────────────────────────────────────────────────
    socket.on('join_exchange_room', async (exchangeId) => {
      try {
        const exchange = await prisma.exchange.findUnique({ where: { id: exchangeId } })
        if (!exchange) return socket.emit('error', { message: 'Exchange not found' })
        const isParticipant = exchange.offerer_id === userId || exchange.requester_id === userId
        if (!isParticipant) return socket.emit('error', { message: 'Not a participant' })
        socket.join(`exchange:${exchangeId}`)
        socket.emit('joined_exchange', { exchangeId })
      } catch (err) {
        socket.emit('error', { message: 'Could not join room' })
      }
    })

    socket.on('leave_exchange_room', (exchangeId) => {
      socket.leave(`exchange:${exchangeId}`)
    })

    // ── Send message ────────────────────────────────────────────────────────
    socket.on('send_message', async ({ exchangeId, content, file_url, message_type = 'TEXT' }) => {
      try {
        if (!content?.trim() && !file_url) return

        const exchange = await prisma.exchange.findUnique({ where: { id: exchangeId } })
        if (!exchange) return socket.emit('error', { message: 'Exchange not found' })
        const isParticipant = exchange.offerer_id === userId || exchange.requester_id === userId
        if (!isParticipant) return socket.emit('error', { message: 'Not a participant' })
        if (['CANCELLED', 'DISPUTED'].includes(exchange.status)) {
          return socket.emit('error', { message: 'Cannot send messages in this exchange' })
        }

        const message = await prisma.message.create({
          data: {
            exchange_id: exchangeId,
            sender_id: userId,
            content: content?.trim() || (message_type === 'FILE' ? 'Sent a file' : ''),
            message_type,
            file_url
          },
          include: { sender: { select: { id: true, full_name: true, username: true, avatar_url: true } } },
        })

        // Move to IN_PROGRESS on first message
        if (exchange.status === 'ACCEPTED') {
          await prisma.exchange.update({ where: { id: exchangeId }, data: { status: 'IN_PROGRESS' } })
          io.to(`exchange:${exchangeId}`).emit('exchange:status_changed', { exchangeId, status: 'IN_PROGRESS' })
        }

        io.to(`exchange:${exchangeId}`).emit('exchange:new_message', { exchangeId, message })

        // Notify the other party
        const otherId = exchange.offerer_id === userId ? exchange.requester_id : exchange.offerer_id
        const notificationBody = message_type === 'FILE' ? 'Sent a file' : (content.length > 60 ? content.slice(0, 60) + '…' : content)

        if (!onlineUsers.has(otherId)) {
          // They're offline — create a DB notification
          await prisma.notification.create({
            data: {
              user_id: otherId,
              type: 'MESSAGE',
              title: `New message from ${socket.user.full_name}`,
              body: notificationBody,
              link: `/exchanges/${exchangeId}`,
            },
          })
        } else {
          // They're online — push real-time notification
          for (const sid of onlineUsers.get(otherId)) {
            io.to(sid).emit('notification:new', {
              type: 'MESSAGE',
              title: `New message from ${socket.user.full_name}`,
              body: notificationBody,
              link: `/exchanges/${exchangeId}`,
            })
          }
        }
      } catch (err) {
        console.error('Socket send_message error:', err)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // ── Typing indicators ───────────────────────────────────────────────────
    socket.on('typing_start', ({ exchangeId }) => {
      socket.to(`exchange:${exchangeId}`).emit('typing_start', { userId, full_name: socket.user.full_name })
    })

    socket.on('typing_stop', ({ exchangeId }) => {
      socket.to(`exchange:${exchangeId}`).emit('typing_stop', { userId })
    })

    // ── Disconnect ──────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      const sockets = onlineUsers.get(userId)
      if (sockets) {
        sockets.delete(socket.id)
        if (sockets.size === 0) {
          onlineUsers.delete(userId)
          io.emit('user:offline', { userId })
        }
      }
      console.log(`🔌 Socket disconnected: ${socket.user.username} (${socket.id})`)
    })
  })

  // Export io for use in controllers
  global._io = io
  return io
}

export const emitToUser = (userId, event, data) => {
  if (global._io && onlineUsers.has(userId)) {
    for (const sid of onlineUsers.get(userId)) {
      global._io.to(sid).emit(event, data)
    }
  }
}
