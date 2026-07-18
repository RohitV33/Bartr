export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR ${req.method} ${req.path}:`, err)

  // ── Prisma DB connection failure (database is down / unreachable) ──────────
  if (
    err.name === 'PrismaClientInitializationError' ||
    err.name === 'PrismaClientRustPanicError' ||
    (err.message && err.message.includes('ENOTFOUND'))
  ) {
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Please try again later.',
    })
  }

  // ── Prisma constraint / query errors ─────────────────────────────────────
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field'
    return res.status(409).json({ success: false, message: `${field} already exists.` })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found.' })
  }

  // ── JWT errors ────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired.' })
  }

  // ── Generic fallback ──────────────────────────────────────────────────────
  const status = err.status || err.statusCode || 500
  const isServerError = status >= 500

  // NEVER expose raw DB / stack details in production
  const message =
    process.env.NODE_ENV === 'production' && isServerError
      ? 'Something went wrong. Please try again later.'
      : err.message || 'Internal server error'

  res.status(status).json({ success: false, message })
}
