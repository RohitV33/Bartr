import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  browseSkills, createSkill, getSkill, updateSkill,
  deleteSkill, getCategories, getSkillMatches, endorseSkill,
} from '../controllers/skill.controller.js'

const router = Router()

const createSkillSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  category_id: z.string().min(1),
  proficiency_level: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']),
  is_offering: z.boolean(),
})

const updateSkillSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  proficiency_level: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']).optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED']).optional(),
})

router.get('/', optionalAuth, browseSkills)
router.get('/categories', getCategories)
router.get('/matches', requireAuth, getSkillMatches)
router.post('/', requireAuth, validate(createSkillSchema), createSkill)
router.get('/:id', optionalAuth, getSkill)
router.put('/:id', requireAuth, validate(updateSkillSchema), updateSkill)
router.delete('/:id', requireAuth, deleteSkill)
router.post('/:id/endorse', requireAuth, endorseSkill)

export default router
