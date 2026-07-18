export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR ${req.method} ${req.path}:`, err)

  // Prisma errors
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field'
    return res.status(409).json({ success: false, message: `${field} already exists.` })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found.' })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired.' })
  }

  // Generic
  const status = err.status || err.statusCode || 500
  const isServerError = status >= 500

  // NEVER leak raw error messages (DB details, stack traces) to the client in production
  const message = (process.env.NODE_ENV === 'production' && isServerError)
    ? 'Something went wrong. Please try again later.'
    : err.message || 'Internal server error'

  res.status(status).json({ success: false, message })
}
