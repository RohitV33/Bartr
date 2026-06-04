import prisma from '../config/db.js'
import { ok, notFound, forbidden, badRequest } from '../utils/response.js'
import { invalidateMatchCache } from '../services/matchingService.js'
import { getMatchesForUser } from '../services/matchingService.js'

const PUBLIC_USER_SELECT = {
  id: true, full_name: true, username: true, avatar_url: true,
  university: true, department: true, year_of_study: true,
  bio: true, reputation_score: true, is_verified: true, created_at: true,
}

// GET /api/users — search users
export const searchUsers = async (req, res, next) => {
  try {
    const { q, university, skill, page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where = {
      is_active: true,
      ...(university && { university: { contains: university, mode: 'insensitive' } }),
      ...(q && {
        OR: [
          { full_name: { contains: q, mode: 'insensitive' } },
          { username: { contains: q, mode: 'insensitive' } },
          { bio: { contains: q, mode: 'insensitive' } },
        ],
      }),
      ...(skill && {
        skills: { some: { title: { contains: skill, mode: 'insensitive' }, status: 'ACTIVE' } },
      }),
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, select: PUBLIC_USER_SELECT,
        orderBy: { reputation_score: 'desc' },
        skip, take: Number(limit),
      }),
      prisma.user.count({ where }),
    ])

    return res.json({ success: true, data: users, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } })
  } catch (err) { next(err) }
}

// GET /api/users/:username — public profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: {
        ...PUBLIC_USER_SELECT,
        is_active: true,
        skills: { where: { status: 'ACTIVE' }, include: { category: true }, orderBy: { created_at: 'desc' } },
        portfolios: { orderBy: { created_at: 'desc' } },
        reviews_received: {
          include: { reviewer: { select: PUBLIC_USER_SELECT } },
          orderBy: { created_at: 'desc' }, take: 10,
        },
        _count: { select: { skills: true, reviews_received: true } },
      },
    })
    if (!user || !user.is_active) return notFound(res, 'User not found.')
    return ok(res, { user })
  } catch (err) { next(err) }
}

// PUT /api/users/me — update profile
export const updateProfile = async (req, res, next) => {
  try {
    const { full_name, bio, university, department, year_of_study } = req.body
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        full_name,
        bio,
        university,
        department,
        year_of_study: year_of_study === null ? null : (year_of_study !== undefined ? Number(year_of_study) : undefined),
      },
      select: { ...PUBLIC_USER_SELECT, onboarding_done: true },
    })
    await invalidateMatchCache(req.user.id)
    return ok(res, { user }, 'Profile updated.')
  } catch (err) { next(err) }
}

// PUT /api/users/me/avatar — upload avatar
export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) return badRequest(res, 'No file uploaded.')
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar_url: req.file.path },
      select: PUBLIC_USER_SELECT,
    })
    return ok(res, { user }, 'Avatar updated.')
  } catch (err) { next(err) }
}

// GET /api/users/me/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id
    const [activeExchanges, recentNotifications, mySkills, recentReviews] = await Promise.all([
      prisma.exchange.findMany({
        where: { OR: [{ offerer_id: userId }, { requester_id: userId }], status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] } },
        include: {
          offerer: { select: PUBLIC_USER_SELECT },
          requester: { select: PUBLIC_USER_SELECT },
          offered_skill: { include: { category: true } },
          requested_skill: { include: { category: true } },
        },
        orderBy: { updated_at: 'desc' }, take: 5,
      }),
      prisma.notification.findMany({
        where: { user_id: userId, is_read: false },
        orderBy: { created_at: 'desc' }, take: 5,
      }),
      prisma.skill.findMany({
        where: { user_id: userId, status: 'ACTIVE' },
        include: { category: true },
        orderBy: { created_at: 'desc' },
      }),
      prisma.review.findMany({
        where: { reviewee_id: userId },
        include: { reviewer: { select: PUBLIC_USER_SELECT } },
        orderBy: { created_at: 'desc' }, take: 3,
      }),
    ])

    const stats = {
      skillsOffered: mySkills.filter(s => s.is_offering).length,
      skillsWanted: mySkills.filter(s => !s.is_offering).length,
      exchanges: await prisma.exchange.count({
        where: { OR: [{ offerer_id: userId }, { requester_id: userId }] }
      }),
      unreadNotifications: recentNotifications.length,
      reputation: req.user.reputation_score,
    }

    const recentExchanges = activeExchanges.map(ex => {
      const partner = ex.offerer_id === userId ? ex.requester : ex.offerer
      return {
        id: ex.id,
        status: ex.status,
        offered_skill: ex.offered_skill,
        requested_skill: ex.requested_skill,
        updated_at: ex.updated_at,
        partner,
      }
    })

    return ok(res, { stats, recentExchanges, recentNotifications, mySkills, recentReviews })
  } catch (err) { next(err) }
}

// GET /api/users/me/matches
export const getMyMatches = async (req, res, next) => {
  try {
    const matches = await getMatchesForUser(req.user.id)
    return ok(res, { matches })
  } catch (err) { next(err) }
}

// DELETE /api/users/me — deactivate
export const deactivateAccount = async (req, res, next) => {
  try {
    await prisma.user.update({ where: { id: req.user.id }, data: { is_active: false } })
    return ok(res, {}, 'Account deactivated.')
  } catch (err) { next(err) }
}

// PUT /api/users/me/onboarding
export const completeOnboarding = async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { onboarding_done: true },
      select: { ...PUBLIC_USER_SELECT, onboarding_done: true },
    })
    return ok(res, { user }, 'Onboarding complete.')
  } catch (err) { next(err) }
}
