import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { uploadAvatar, handleUploadError } from '../middleware/upload.js'
import {
  searchUsers, getUserProfile, updateProfile, updateAvatar,
  getDashboard, getMyMatches, deactivateAccount, completeOnboarding,
} from '../controllers/user.controller.js'

const router = Router()

const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(80).optional(),
  bio: z.string().max(500).nullable().optional(),
  university: z.string().max(120).nullable().optional(),
  department: z.string().max(120).nullable().optional(),
  year_of_study: z.preprocess(
    (val) => (val === '' || val === null) ? null : val,
    z.coerce.number().int().min(1).max(8).nullable().optional()
  ),
})

router.get('/', searchUsers)
router.get('/me/dashboard', requireAuth, getDashboard)
router.get('/me/matches', requireAuth, getMyMatches)
router.put('/me', requireAuth, validate(updateProfileSchema), updateProfile)
router.put('/me/avatar', requireAuth, (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) return handleUploadError(err, req, res, next)
    next()
  })
}, updateAvatar)
router.put('/me/onboarding', requireAuth, completeOnboarding)
router.delete('/me', requireAuth, deactivateAccount)
router.get('/:username', getUserProfile)

export default router
