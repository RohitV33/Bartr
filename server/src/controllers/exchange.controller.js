import prisma from '../config/db.js'
import { ok, created, notFound, forbidden, badRequest, paginated } from '../utils/response.js'
import { notifyExchangeUpdate } from '../services/notificationService.js'
import { sendExchangeProposalEmail, sendExchangeAcceptedEmail, sendExchangeCompletedEmail } from '../services/emailService.js'

const EXCHANGE_INCLUDE = {
  offerer: { select: { id: true, full_name: true, username: true, avatar_url: true, university: true, reputation_score: true } },
  requester: { select: { id: true, full_name: true, username: true, avatar_url: true, university: true, reputation_score: true } },
  offered_skill: { include: { category: true } },
  requested_skill: { include: { category: true } },
  _count: { select: { messages: true } },
}

const isParticipant = (exchange, userId) =>
  exchange.offerer_id === userId || exchange.requester_id === userId

// GET /api/exchanges
export const getMyExchanges = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const userId = req.user.id
    const skip = (Number(page) - 1) * Number(limit)

    const where = {
      OR: [{ offerer_id: userId }, { requester_id: userId }],
      ...(status && { status }),
    }

    const [exchanges, total] = await Promise.all([
      prisma.exchange.findMany({ where, include: EXCHANGE_INCLUDE, orderBy: { updated_at: 'desc' }, skip, take: Number(limit) }),
      prisma.exchange.count({ where }),
    ])

    return paginated(res, exchanges, total, page, limit)
  } catch (err) { next(err) }
}

// POST /api/exchanges — propose
export const proposeExchange = async (req, res, next) => {
  try {
    const { offered_skill_id, requested_skill_id } = req.body

    const [offeredSkill, requestedSkill] = await Promise.all([
      prisma.skill.findUnique({ where: { id: offered_skill_id }, include: { user: true } }),
      prisma.skill.findUnique({ where: { id: requested_skill_id }, include: { user: true } }),
    ])

    if (!offeredSkill || !requestedSkill) return notFound(res, 'Skill not found.')
    if (offeredSkill.user_id !== req.user.id) return forbidden(res, 'You can only offer your own skills.')
    if (requestedSkill.user_id === req.user.id) return badRequest(res, 'Cannot request your own skill.')

    // Check no duplicate pending exchange
    const existing = await prisma.exchange.findFirst({
      where: {
        offerer_id: req.user.id,
        requester_id: requestedSkill.user_id,
        status: 'PENDING',
      },
    })
    if (existing) return badRequest(res, 'You already have a pending exchange with this user.')

    const exchange = await prisma.exchange.create({
      data: {
        offerer_id: req.user.id,
        requester_id: requestedSkill.user_id,
        offered_skill_id,
        requested_skill_id,
      },
      include: EXCHANGE_INCLUDE,
    })

    // Notify + email the requester's owner
    await notifyExchangeUpdate(
      requestedSkill.user_id,
      'New exchange proposal!',
      `${req.user.full_name} wants to exchange skills with you.`,
      exchange.id
    )
    try {
      await sendExchangeProposalEmail(requestedSkill.user, req.user, exchange)
    } catch (_) {}

    return created(res, { exchange }, 'Exchange proposed.')
  } catch (err) { next(err) }
}

// GET /api/exchanges/:id
export const getExchange = async (req, res, next) => {
  try {
    const exchange = await prisma.exchange.findUnique({
      where: { id: req.params.id },
      include: {
        ...EXCHANGE_INCLUDE,
        reviews: { include: { reviewer: { select: { id: true, full_name: true, username: true, avatar_url: true } } } },
      },
    })
    if (!exchange) return notFound(res, 'Exchange not found.')
    if (!isParticipant(exchange, req.user.id)) return forbidden(res)
    return ok(res, { exchange })
  } catch (err) { next(err) }
}

// PUT /api/exchanges/:id/accept
export const acceptExchange = async (req, res, next) => {
  try {
    const exchange = await prisma.exchange.findUnique({ where: { id: req.params.id } })
    if (!exchange) return notFound(res)
    if (exchange.requester_id !== req.user.id) return forbidden(res, 'Only the skill owner can accept.')
    if (exchange.status !== 'PENDING') return badRequest(res, 'Exchange is not pending.')

    const updated = await prisma.exchange.update({
      where: { id: exchange.id },
      data: { status: 'ACCEPTED', agreed_at: new Date() },
      include: EXCHANGE_INCLUDE,
    })

    await notifyExchangeUpdate(exchange.offerer_id, 'Exchange accepted!', `Your exchange proposal was accepted.`, exchange.id)
    try {
      const offerer = await prisma.user.findUnique({ where: { id: exchange.offerer_id } })
      const accepter = await prisma.user.findUnique({ where: { id: req.user.id } })
      await sendExchangeAcceptedEmail(offerer, accepter)
    } catch (_) {}

    return ok(res, { exchange: updated }, 'Exchange accepted.')
  } catch (err) { next(err) }
}

// PUT /api/exchanges/:id/decline
export const declineExchange = async (req, res, next) => {
  try {
    const exchange = await prisma.exchange.findUnique({ where: { id: req.params.id } })
    if (!exchange) return notFound(res)
    if (!isParticipant(exchange, req.user.id)) return forbidden(res)
    if (exchange.status !== 'PENDING') return badRequest(res, 'Exchange is not pending.')

    const updated = await prisma.exchange.update({
      where: { id: exchange.id },
      data: { status: 'CANCELLED' },
      include: EXCHANGE_INCLUDE,
    })

    const otherId = exchange.offerer_id === req.user.id ? exchange.requester_id : exchange.offerer_id
    await notifyExchangeUpdate(otherId, 'Exchange declined', 'Your exchange proposal was declined.', exchange.id)

    return ok(res, { exchange: updated }, 'Exchange declined.')
  } catch (err) { next(err) }
}

// PUT /api/exchanges/:id/complete — both must confirm
export const completeExchange = async (req, res, next) => {
  try {
    const exchange = await prisma.exchange.findUnique({ where: { id: req.params.id } })
    if (!exchange) return notFound(res)
    if (!isParticipant(exchange, req.user.id)) return forbidden(res)
    if (!['ACCEPTED', 'IN_PROGRESS'].includes(exchange.status)) return badRequest(res, 'Exchange cannot be completed.')

    const isOfferer = exchange.offerer_id === req.user.id
    const updateData = isOfferer ? { offerer_confirmed: true } : { requester_confirmed: true }

    const updated = await prisma.exchange.update({ where: { id: exchange.id }, data: updateData })

    const bothConfirmed = updated.offerer_confirmed && updated.requester_confirmed
    if (bothConfirmed) {
      const completed = await prisma.exchange.update({
        where: { id: exchange.id },
        data: { status: 'COMPLETED', completed_at: new Date() },
        include: EXCHANGE_INCLUDE,
      })

      // Update reputation scores
      await Promise.all([
        prisma.user.update({ where: { id: exchange.offerer_id }, data: { reputation_score: { increment: 0.1 } } }),
        prisma.user.update({ where: { id: exchange.requester_id }, data: { reputation_score: { increment: 0.1 } } }),
      ])

      const otherId = isOfferer ? exchange.requester_id : exchange.offerer_id
      await notifyExchangeUpdate(otherId, 'Exchange completed!', 'The exchange has been marked complete. Leave a review!', exchange.id)

      try {
        const [offerer, requester] = await Promise.all([
          prisma.user.findUnique({ where: { id: exchange.offerer_id } }),
          prisma.user.findUnique({ where: { id: exchange.requester_id } }),
        ])
        await sendExchangeCompletedEmail(offerer, requester)
        await sendExchangeCompletedEmail(requester, offerer)
      } catch (_) {}

      return ok(res, { exchange: completed }, 'Exchange completed!')
    }

    return ok(res, { exchange: updated }, 'Completion confirmed. Waiting for the other party.')
  } catch (err) { next(err) }
}

// PUT /api/exchanges/:id/cancel
export const cancelExchange = async (req, res, next) => {
  try {
    const exchange = await prisma.exchange.findUnique({ where: { id: req.params.id } })
    if (!exchange) return notFound(res)
    if (!isParticipant(exchange, req.user.id)) return forbidden(res)
    if (['COMPLETED', 'CANCELLED'].includes(exchange.status)) return badRequest(res, 'Cannot cancel this exchange.')

    const updated = await prisma.exchange.update({
      where: { id: exchange.id },
      data: { status: 'CANCELLED' },
      include: EXCHANGE_INCLUDE,
    })

    const otherId = exchange.offerer_id === req.user.id ? exchange.requester_id : exchange.offerer_id
    await notifyExchangeUpdate(otherId, 'Exchange cancelled', 'An exchange has been cancelled.', exchange.id)

    return ok(res, { exchange: updated }, 'Exchange cancelled.')
  } catch (err) { next(err) }
}

// PUT /api/exchanges/:id/dispute
export const disputeExchange = async (req, res, next) => {
  try {
    const exchange = await prisma.exchange.findUnique({ where: { id: req.params.id } })
    if (!exchange) return notFound(res)
    if (!isParticipant(exchange, req.user.id)) return forbidden(res)
    if (exchange.status !== 'IN_PROGRESS' && exchange.status !== 'ACCEPTED') return badRequest(res, 'Cannot dispute this exchange.')

    const updated = await prisma.exchange.update({
      where: { id: exchange.id },
      data: { status: 'DISPUTED' },
      include: EXCHANGE_INCLUDE,
    })
    return ok(res, { exchange: updated }, 'Dispute raised. Our team will review.')
  } catch (err) { next(err) }
}

// ── Messages ──────────────────────────────────────────────────────────────────

export const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 50 } = req.query

    const exchange = await prisma.exchange.findUnique({ where: { id } })
    if (!exchange) return notFound(res)
    if (!isParticipant(exchange, req.user.id)) return forbidden(res)

    const skip = (Number(page) - 1) * Number(limit)
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { exchange_id: id },
        include: { sender: { select: { id: true, full_name: true, username: true, avatar_url: true } } },
        orderBy: { created_at: 'asc' },
        skip, take: Number(limit),
      }),
      prisma.message.count({ where: { exchange_id: id } }),
    ])

    return paginated(res, messages, total, page, limit)
  } catch (err) { next(err) }
}

export const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params
    const { content } = req.body

    const exchange = await prisma.exchange.findUnique({ where: { id } })
    if (!exchange) return notFound(res)
    if (!isParticipant(exchange, req.user.id)) return forbidden(res)
    if (['CANCELLED', 'DISPUTED'].includes(exchange.status)) return badRequest(res, 'Cannot send messages in this exchange.')

    const message = await prisma.message.create({
      data: { exchange_id: id, sender_id: req.user.id, content },
      include: { sender: { select: { id: true, full_name: true, username: true, avatar_url: true } } },
    })

    // If exchange is still ACCEPTED, move to IN_PROGRESS on first message
    if (exchange.status === 'ACCEPTED') {
      await prisma.exchange.update({ where: { id }, data: { status: 'IN_PROGRESS' } })
    }

    return created(res, { message })
  } catch (err) { next(err) }
}

export const uploadExchangeFile = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!req.file) return badRequest(res, 'No file uploaded.')
    
    const exchange = await prisma.exchange.findUnique({ where: { id } })
    if (!exchange) return notFound(res)
    if (!isParticipant(exchange, req.user.id)) return forbidden(res)
    
    return ok(res, { file_url: req.file.path, file_type: req.file.mimetype }, 'File uploaded.')
  } catch (err) { next(err) }
}

export const markMessagesRead = async (req, res, next) => {
  try {
    const { id } = req.params
    const exchange = await prisma.exchange.findUnique({ where: { id } })
    if (!exchange) return notFound(res)
    if (!isParticipant(exchange, req.user.id)) return forbidden(res)

    await prisma.message.updateMany({
      where: { exchange_id: id, sender_id: { not: req.user.id }, read_at: null },
      data: { read_at: new Date() },
    })
    return ok(res, {}, 'Messages marked as read.')
  } catch (err) { next(err) }
}
