import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { submitReview, getUserReviews, getExchangeReviews } from '../controllers/review.controller.js'

const router = Router()

const reviewSchema = z.object({
  exchange_id: z.string().min(1),
  reviewee_id: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
})

router.post('/', requireAuth, validate(reviewSchema), submitReview)
router.get('/user/:userId', getUserReviews)
router.get('/exchange/:exchangeId', getExchangeReviews)

export default router
