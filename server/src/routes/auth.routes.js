import { Router } from 'express'
import passport from 'passport'
import { z } from 'zod'
import { validate } from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { requireAuth } from '../middleware/auth.js'
import {
  register, login, logout, getMe,
  verifyEmail, resendVerification, verifyEmailOtp,
  forgotPassword, resetPassword, googleCallback,
} from '../controllers/auth.controller.js'

const router = Router()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2).max(80),
  university: z.string().max(120).optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const forgotSchema = z.object({ email: z.string().email() })

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
})

const verifySchema = z.object({ token: z.string().min(1) })

router.post('/register', authLimiter, validate(registerSchema), register)
router.post('/login', authLimiter, validate(loginSchema), login)
router.post('/logout', logout)
router.get('/me', requireAuth, getMe)
router.post('/verify-email', validate(verifySchema), verifyEmail)
router.post('/verify-email-otp', authLimiter, verifyEmailOtp)
router.post('/resend-verification', requireAuth, resendVerification)
router.post('/forgot-password', authLimiter, validate(forgotSchema), forgotPassword)
router.post('/reset-password', authLimiter, validate(resetSchema), resetPassword)

// Google OAuth credentials check middleware
const checkGoogleConfig = (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({
      success: false,
      message: 'Google OAuth is not configured in this environment. Please log in with email and password.'
    })
  }
  next()
}

// Google OAuth
router.get('/google', checkGoogleConfig, passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

// Custom handler so DB failures during OAuth redirect gracefully instead of leaking raw errors
router.get('/google/callback',
  checkGoogleConfig,
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user) => {
      if (err) {
        console.error('[OAuth] Google callback error:', err.name, '-', err.message?.slice(0, 120))
        // DB down or any server error → redirect to client error page
        const isServerError =
          err.name === 'PrismaClientInitializationError' ||
          err.name === 'PrismaClientRustPanicError' ||
          (err.message && err.message.includes('ENOTFOUND'))
        const code = isServerError ? 'server_error' : 'oauth'
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/error?code=${code}`)
      }
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/error?code=oauth`)
      }
      req.user = user
      next()
    })(req, res, next)
  },
  googleCallback
)

export default router
