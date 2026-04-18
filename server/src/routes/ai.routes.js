import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  generateSkillDescription,
  explainMatch,
  coachExchange,
  generateBio,
} from '../controllers/ai.controller.js'

const router = Router()

// All AI routes require authentication
router.use(requireAuth)

router.post('/skill-description', generateSkillDescription)
router.post('/explain-match',     explainMatch)
router.post('/exchange-coach',    coachExchange)
router.post('/generate-bio',      generateBio)

export default router
