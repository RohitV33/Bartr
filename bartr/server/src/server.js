import 'dotenv/config'
import { createServer } from 'http'
import app from './app.js'
import { initSocket } from './sockets/socket.js'

const PORT = process.env.PORT || 4000

const httpServer = createServer(app)

// Initialise Socket.io
initSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log(`\n🚀 Bartr API running on http://localhost:${PORT}`)
  console.log(`📡 Socket.io ready`)
  console.log(`🌱 Environment: ${process.env.NODE_ENV || 'development'}\n`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  httpServer.close(() => {
    console.log('Server closed.')
    process.exit(0)
  })
})
