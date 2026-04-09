import prisma from '../config/db.js'
import { ok, created, notFound, forbidden, paginated } from '../utils/response.js'
import { invalidateMatchCache } from '../services/matchingService.js'
import { getMatchesForUser } from '../services/matchingService.js'

const SKILL_INCLUDE = {
  user: {
    select: { id: true, full_name: true, username: true, avatar_url: true, university: true, reputation_score: true },
  },
  category: true,
  _count: { select: { endorsements: true } },
}

// GET /api/skills — browse all
export const browseSkills = async (req, res, next) => {
  try {
    const { category, type, university, q, page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where = {
      status: 'ACTIVE',
      user: { is_active: true },
      ...(category && { category: { slug: category } }),
      ...(type === 'offering' && { is_offering: true }),
      ...(type === 'requesting' && { is_offering: false }),
      ...(university && { user: { university: { contains: university, mode: 'insensitive' } } }),
      ...(q && {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      }),
    }

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({ where, include: SKILL_INCLUDE, orderBy: { created_at: 'desc' }, skip, take: Number(limit) }),
      prisma.skill.count({ where }),
    ])

    return paginated(res, skills, total, page, limit)
  } catch (err) { next(err) }
}

// POST /api/skills — create
export const createSkill = async (req, res, next) => {
  try {
    const { title, description, category_id, proficiency_level, is_offering } = req.body

    const category = await prisma.category.findUnique({ where: { id: category_id } })
    if (!category) return res.status(400).json({ success: false, message: 'Invalid category.' })

    const skill = await prisma.skill.create({
      data: { user_id: req.user.id, title, description, category_id, proficiency_level, is_offering },
      include: SKILL_INCLUDE,
    })

    await invalidateMatchCache(req.user.id)
    return created(res, { skill }, 'Skill created.')
  } catch (err) { next(err) }
}

// GET /api/skills/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    return ok(res, { categories })
  } catch (err) { next(err) }
}

// GET /api/skills/matches
export const getSkillMatches = async (req, res, next) => {
  try {
    const matches = await getMatchesForUser(req.user.id)
    return ok(res, { matches })
  } catch (err) { next(err) }
}

// GET /api/skills/:id
export const getSkill = async (req, res, next) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: req.params.id },
      include: {
        ...SKILL_INCLUDE,
        endorsements: { include: { endorser: { select: { id: true, full_name: true, username: true, avatar_url: true } } } },
        user: {
          select: {
            id: true, full_name: true, username: true, avatar_url: true,
            university: true, reputation_score: true, bio: true,
            skills: { where: { status: 'ACTIVE', id: { not: req.params.id } }, include: { category: true }, take: 4 },
          },
        },
      },
    })
    if (!skill) return notFound(res, 'Skill not found.')
    return ok(res, { skill })
  } catch (err) { next(err) }
}

// PUT /api/skills/:id
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await prisma.skill.findUnique({ where: { id: req.params.id } })
    if (!skill) return notFound(res, 'Skill not found.')
    if (skill.user_id !== req.user.id) return forbidden(res)

    const updated = await prisma.skill.update({
      where: { id: req.params.id },
      data: req.body,
      include: SKILL_INCLUDE,
    })
    await invalidateMatchCache(req.user.id)
    return ok(res, { skill: updated }, 'Skill updated.')
  } catch (err) { next(err) }
}

// DELETE /api/skills/:id
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await prisma.skill.findUnique({ where: { id: req.params.id } })
    if (!skill) return notFound(res, 'Skill not found.')
    if (skill.user_id !== req.user.id) return forbidden(res)

    await prisma.skill.delete({ where: { id: req.params.id } })
    await invalidateMatchCache(req.user.id)
    return ok(res, {}, 'Skill deleted.')
  } catch (err) { next(err) }
}

// POST /api/skills/:id/endorse
export const endorseSkill = async (req, res, next) => {
  try {
    const skill = await prisma.skill.findUnique({ where: { id: req.params.id } })
    if (!skill) return notFound(res, 'Skill not found.')
    if (skill.user_id === req.user.id) return res.status(400).json({ success: false, message: 'Cannot endorse your own skill.' })

    const existing = await prisma.skillEndorsement.findUnique({
      where: { skill_id_endorser_id: { skill_id: req.params.id, endorser_id: req.user.id } },
    })

    if (existing) {
      await prisma.skillEndorsement.delete({ where: { id: existing.id } })
      return ok(res, { endorsed: false }, 'Endorsement removed.')
    }

    await prisma.skillEndorsement.create({ data: { skill_id: req.params.id, endorser_id: req.user.id } })
    return ok(res, { endorsed: true }, 'Skill endorsed.')
  } catch (err) { next(err) }
}
