import bcrypt from 'bcrypt'
import { z } from 'zod'
import prisma from '../config/db.js'
import { signToken, setAuthCookie, clearAuthCookie, generateSecureToken } from '../utils/tokenUtils.js'
import { ok, created, badRequest } from '../utils/response.js'
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../services/emailService.js'

const BCRYPT_ROUNDS = 12

// ── Register ──────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, university } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return badRequest(res, 'An account with this email already exists.')

    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS)

    // Generate unique username from email
    const baseUsername = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 20)
    let username = baseUsername
    let count = 0
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${++count}`
    }

    const user = await prisma.user.create({
      data: { email, password_hash, full_name, username, university },
      select: { id: true, email: true, full_name: true, username: true, is_verified: true },
    })

    // Create verification token
    const token = generateSecureToken()
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    await prisma.emailVerification.create({ data: { user_id: user.id, token, expires_at } })

    try {
      await sendVerificationEmail({ email: user.email, full_name: user.full_name }, token)
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr.message)
    }

    const jwtToken = signToken(user.id)
    setAuthCookie(res, jwtToken)

    return created(res, { user }, 'Account created. Please verify your email.')
  } catch (err) {
    next(err)
  }
}

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password_hash) {
      return badRequest(res, 'Invalid email or password.')
    }
    if (!user.is_active) {
      return badRequest(res, 'This account has been deactivated.')
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return badRequest(res, 'Invalid email or password.')

    const token = signToken(user.id)
    setAuthCookie(res, token)

    const { password_hash, ...safeUser } = user
    return ok(res, { user: safeUser }, 'Logged in successfully.')
  } catch (err) {
    next(err)
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────
export const logout = (req, res) => {
  clearAuthCookie(res)
  return ok(res, {}, 'Logged out successfully.')
}

// ── Me ────────────────────────────────────────────────────────────────────────
export const getMe = (req, res) => {
  return ok(res, { user: req.user })
}

// ── Verify Email ──────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body

    const verification = await prisma.emailVerification.findUnique({ where: { token } })
    if (!verification) return badRequest(res, 'Invalid or expired verification token.')
    if (verification.used_at) return badRequest(res, 'This token has already been used.')
    if (new Date() > verification.expires_at) return badRequest(res, 'Verification token expired.')

    await prisma.$transaction([
      prisma.user.update({ where: { id: verification.user_id }, data: { is_verified: true } }),
      prisma.emailVerification.update({ where: { id: verification.id }, data: { used_at: new Date() } }),
    ])

    return ok(res, {}, 'Email verified successfully.')
  } catch (err) {
    next(err)
  }
}

// ── Resend Verification ───────────────────────────────────────────────────────
export const resendVerification = async (req, res, next) => {
  try {
    const user = req.user
    if (user.is_verified) return badRequest(res, 'Email is already verified.')

    await prisma.emailVerification.deleteMany({ where: { user_id: user.id } })

    const token = generateSecureToken()
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await prisma.emailVerification.create({ data: { user_id: user.id, token, expires_at } })

    await sendVerificationEmail({ email: user.email, full_name: user.full_name }, token)

    return ok(res, {}, 'Verification email sent.')
  } catch (err) {
    next(err)
  }
}

// ── Forgot Password ───────────────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    // Always respond OK to prevent email enumeration
    if (!user) return ok(res, {}, 'If an account exists, a reset link has been sent.')

    await prisma.passwordReset.deleteMany({ where: { user_id: user.id } })

    const token = generateSecureToken()
    const expires_at = new Date(Date.now() + 60 * 60 * 1000) // 1h
    await prisma.passwordReset.create({ data: { user_id: user.id, token, expires_at } })

    try {
      await sendPasswordResetEmail({ email: user.email, full_name: user.full_name }, token)
    } catch (emailErr) {
      console.error('Failed to send reset email:', emailErr.message)
    }

    return ok(res, {}, 'If an account exists, a reset link has been sent.')
  } catch (err) {
    next(err)
  }
}

// ── Reset Password ────────────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body

    const reset = await prisma.passwordReset.findUnique({ where: { token } })
    if (!reset) return badRequest(res, 'Invalid or expired reset token.')
    if (reset.used_at) return badRequest(res, 'This token has already been used.')
    if (new Date() > reset.expires_at) return badRequest(res, 'Reset token expired.')

    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS)

    await prisma.$transaction([
      prisma.user.update({ where: { id: reset.user_id }, data: { password_hash } }),
      prisma.passwordReset.update({ where: { id: reset.id }, data: { used_at: new Date() } }),
    ])

    return ok(res, {}, 'Password reset successfully. You can now log in.')
  } catch (err) {
    next(err)
  }
}

// ── Google OAuth callback ─────────────────────────────────────────────────────
export const googleCallback = (req, res) => {
  const token = signToken(req.user.id)
  setAuthCookie(res, token)
  const redirect = req.user.onboarding_done
    ? `${process.env.CLIENT_URL}/dashboard`
    : `${process.env.CLIENT_URL}/onboarding`
  res.redirect(redirect)
}
