import prisma from '../config/db.js'
import { ok, badRequest } from '../utils/response.js'
import * as aiService from '../services/aiService.js'

// POST /api/ai/skill-description
export const generateSkillDescription = async (req, res, next) => {
  try {
    const { title, category_id, proficiency_level, is_offering } = req.body
    if (!title || !category_id) return badRequest(res, 'title and category_id are required.')

    const category = await prisma.category.findUnique({ where: { id: category_id } })
    if (!category) return badRequest(res, 'Invalid category.')

    const description = await aiService.generateSkillDescription({
      title,
      categoryName: category.name,
      proficiency_level: proficiency_level || 'INTERMEDIATE',
      is_offering: Boolean(is_offering),
    })

    return ok(res, { description })
  } catch (err) { next(err) }
}

// POST /api/ai/explain-match
export const explainMatch = async (req, res, next) => {
  try {
    const { matchUserId, myOfferingTitle, theirOfferingTitle, myRequestTitle, theirRequestTitle } = req.body
    if (!matchUserId) return badRequest(res, 'matchUserId is required.')

    const matchUser = await prisma.user.findUnique({
      where: { id: matchUserId },
      select: { full_name: true },
    })
    if (!matchUser) return badRequest(res, 'User not found.')

    const explanation = await aiService.explainMatch({
      currentUser: req.user.full_name,
      matchUser: matchUser.full_name,
      myOffering: myOfferingTitle || 'a skill',
      theirOffering: theirOfferingTitle || 'a skill',
      myRequest: myRequestTitle || 'something',
      theirRequest: theirRequestTitle || 'something',
    })

    return ok(res, { explanation })
  } catch (err) { next(err) }
}

// POST /api/ai/exchange-coach
export const coachExchange = async (req, res, next) => {
  try {
    const { exchangeId } = req.body
    if (!exchangeId) return badRequest(res, 'exchangeId is required.')

    const exchange = await prisma.exchange.findUnique({
      where: { id: exchangeId },
      include: {
        offerer: { select: { id: true, full_name: true } },
        requester: { select: { id: true, full_name: true } },
        offered_skill: { select: { title: true } },
        requested_skill: { select: { title: true } },
        messages: {
          include: { sender: { select: { full_name: true } } },
          orderBy: { created_at: 'desc' },
          take: 6,
        },
      },
    })

    if (!exchange) return badRequest(res, 'Exchange not found.')
    const isParticipant = exchange.offerer_id === req.user.id || exchange.requester_id === req.user.id
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Forbidden' })

    const isOfferer = exchange.offerer_id === req.user.id
    const partner = isOfferer ? exchange.requester : exchange.offerer
    const mySkill = isOfferer ? exchange.offered_skill?.title : exchange.requested_skill?.title
    const theirSkill = isOfferer ? exchange.requested_skill?.title : exchange.offered_skill?.title

    const recentMessages = [...exchange.messages].reverse().map(m => ({
      senderName: m.sender.full_name,
      content: m.content,
    }))

    const suggestion = await aiService.coachExchange({
      partnerName: partner.full_name,
      mySkill: mySkill || 'a skill',
      theirSkill: theirSkill || 'a skill',
      status: exchange.status,
      recentMessages,
    })

    return ok(res, { suggestion })
  } catch (err) { next(err) }
}

// POST /api/ai/generate-bio
export const generateBio = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { skills: { where: { status: 'ACTIVE' }, select: { title: true, is_offering: true } } },
    })
    if (!user) return badRequest(res, 'User not found.')

    const bio = await aiService.generateBio({
      full_name: user.full_name,
      university: user.university,
      department: user.department,
      year_of_study: user.year_of_study,
      skills: user.skills,
    })

    return ok(res, { bio })
  } catch (err) { next(err) }
}
