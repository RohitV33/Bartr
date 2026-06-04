import { Router } from 'express'
import { submitContactForm } from '../controllers/contact.controller.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

// Public endpoint, handles optional authenticated info
router.post('/', optionalAuth, submitContactForm)

export default router
