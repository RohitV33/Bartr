import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { corsOptions } from './config/cors.js'
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
import aiRoutes from './routes/ai.routes.js'
import contactRoutes from './routes/contact.routes.js'

const app = express()
app.set('trust proxy', 1)

// Serve local uploads statically
app.use('/uploads', express.static('uploads'))

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

app.use(cors(corsOptions))

app.use(globalLimiter)

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))
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
app.use('/api/ai', aiRoutes)
app.use('/api/contact', contactRoutes)

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` })
})

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use(errorHandler)

export default app
