import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { globalLimiter } from './middleware/rateLimiter.js'
import { errorHandler } from './middleware/errorHandler.js'
import './config/passport.js'

// Routes
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import skillRoutes from './routes/skill.routes.js'
import exchangeRoutes from './routes/exchange.routes.js'
import reviewRoutes from './routes/review.routes.js'
import portfolioRoutes from './routes/portfolio.routes.js'
import notificationRoutes from './routes/notification.routes.js'

const app = express()

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', 'https://placehold.co'],
    },
  },
}))

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(globalLimiter)

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser(process.env.COOKIE_SECRET))

// ─── Passport ─────────────────────────────────────────────────────────────────
app.use(passport.initialize())

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/exchanges', exchangeRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/notifications', notificationRoutes)

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` })
})

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use(errorHandler)

export default app
