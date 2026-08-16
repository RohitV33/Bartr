/**
 * Centralized CORS Configuration
 * Handles single or comma-separated CLIENT_URL values, trims trailing slashes,
 * and allows standard local development ports.
 */

export const getAllowedOrigins = () => {
  const envOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/+$/, ''))
    : []

  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
  ]

  return Array.from(new Set([...envOrigins, ...defaultOrigins].filter(Boolean)))
}

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, postman, server-to-server)
    if (!origin) return callback(null, true)

    const allowed = getAllowedOrigins()
    const sanitizedOrigin = origin.replace(/\/+$/, '')

    if (allowed.includes(sanitizedOrigin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }

    return callback(new Error(`CORS origin '${origin}' not allowed.`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}
