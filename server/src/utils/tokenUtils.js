import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_in_production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export const signToken = (userId) => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET)
}

export const generateSecureToken = () => uuidv4().replace(/-/g, '')

export const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.RENDER
  res.cookie('bartr_token', token, {
    httpOnly: true,
    secure: isProd,        
    sameSite: isProd ? 'None' : 'Lax',   
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

export const clearAuthCookie = (res) => {
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.RENDER
  res.clearCookie('bartr_token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
    path: '/',
  })
}
