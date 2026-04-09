import { Router } from 'express'
import passport from 'passport'
import { z } from 'zod'
import { validate } from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { requireAuth } from '../middleware/auth.js'
import {
  register, login, logout, getMe,
  verifyEmail, resendVerification,
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
router.post('/resend-verification', requireAuth, resendVerification)
router.post('/forgot-password', authLimiter, validate(forgotSchema), forgotPassword)
router.post('/reset-password', authLimiter, validate(resetSchema), resetPassword)

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth` }),
  googleCallback
)

export default router
