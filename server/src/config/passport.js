import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import prisma from './db.js'

// ─── JWT Strategy ─────────────────────────────────────────────────────────────
const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) {
    token = req.cookies['bartr_token']
  }
  return token
}

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET || 'changeme_in_production',
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.sub },
          select: {
            id: true, email: true, full_name: true, username: true,
            avatar_url: true, university: true, department: true,
            year_of_study: true, bio: true, reputation_score: true,
            is_verified: true, is_active: true, onboarding_done: true,
            created_at: true,
          },
        })
        if (!user || !user.is_active) return done(null, false)
        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    }
  )
)

// ─── Google OAuth Strategy ───────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value
          if (!email) return done(null, false, { message: 'No email from Google' })

          let user = await prisma.user.findUnique({ where: { google_id: profile.id } })

          if (!user) {
            user = await prisma.user.findUnique({ where: { email } })
            if (user) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { google_id: profile.id, is_verified: true, avatar_url: user.avatar_url || profile.photos?.[0]?.value },
              })
            } else {
              const baseUsername = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase()
              let username = baseUsername
              let count = 0
              while (await prisma.user.findUnique({ where: { username } })) {
                username = `${baseUsername}${++count}`
              }
              user = await prisma.user.create({
                data: {
                  email,
                  google_id: profile.id,
                  full_name: profile.displayName || email.split('@')[0],
                  username,
                  avatar_url: profile.photos?.[0]?.value,
                  is_verified: true,
                },
              })
            }
          }

          return done(null, user)
        } catch (err) {
          return done(err, false)
        }
      }
    )
  )
}

export default passport
