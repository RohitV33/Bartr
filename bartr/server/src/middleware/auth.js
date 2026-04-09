import passport from 'passport'

export const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || 'Authentication required',
      })
    }
    req.user = user
    next()
  })(req, res, next)
}

export const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!err && user) req.user = user
    next()
  })(req, res, next)
}
