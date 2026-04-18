import prisma from '../config/db.js'
import { ok, created, notFound, forbidden, badRequest } from '../utils/response.js'
import { notifyNewReview } from '../services/notificationService.js'
import { sendNewReviewEmail } from '../services/emailService.js'

export const submitReview = async (req, res, next) => {
  try {
    const { exchange_id, reviewee_id, rating, comment } = req.body

    const exchange = await prisma.exchange.findUnique({ where: { id: exchange_id } })
    if (!exchange) return notFound(res, 'Exchange not found.')
    if (exchange.status !== 'COMPLETED') return badRequest(res, 'Can only review completed exchanges.')

    const isParticipant = exchange.offerer_id === req.user.id || exchange.requester_id === req.user.id
    if (!isParticipant) return forbidden(res)
    if (reviewee_id === req.user.id) return badRequest(res, 'Cannot review yourself.')

    const isOtherParticipant = exchange.offerer_id === reviewee_id || exchange.requester_id === reviewee_id
    if (!isOtherParticipant) return forbidden(res, 'Reviewee must be part of this exchange.')

    const existingReview = await prisma.review.findUnique({
      where: { exchange_id_reviewer_id: { exchange_id, reviewer_id: req.user.id } },
    })
    if (existingReview) return badRequest(res, 'You have already reviewed this exchange.')

    const review = await prisma.review.create({
      data: { exchange_id, reviewer_id: req.user.id, reviewee_id, rating, comment },
      include: {
        reviewer: { select: { id: true, full_name: true, username: true, avatar_url: true } },
      },
    })

    // Recalculate reputation score (average of all ratings)
    const { _avg } = await prisma.review.aggregate({
      where: { reviewee_id },
      _avg: { rating: true },
    })
    await prisma.user.update({ where: { id: reviewee_id }, data: { reputation_score: _avg.rating || 0 } })

    await notifyNewReview(reviewee_id, req.user.full_name, rating)
    try {
      const reviewee = await prisma.user.findUnique({ where: { id: reviewee_id } })
      await sendNewReviewEmail(reviewee, req.user, rating)
    } catch (_) {}

    return created(res, { review }, 'Review submitted.')
  } catch (err) { next(err) }
}

export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { reviewee_id: req.params.userId },
      include: { reviewer: { select: { id: true, full_name: true, username: true, avatar_url: true } } },
      orderBy: { created_at: 'desc' },
    })
    return ok(res, { reviews })
  } catch (err) { next(err) }
}

export const getExchangeReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { exchange_id: req.params.exchangeId },
      include: {
        reviewer: { select: { id: true, full_name: true, username: true, avatar_url: true } },
        reviewee: { select: { id: true, full_name: true, username: true, avatar_url: true } },
      },
    })
    return ok(res, { reviews })
  } catch (err) { next(err) }
}
