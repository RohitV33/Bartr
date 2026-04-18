import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getNotifications, markOneRead, markAllRead, deleteNotification } from '../controllers/notification.controller.js'

const router = Router()

router.get('/', requireAuth, getNotifications)
router.put('/read-all', requireAuth, markAllRead)
router.put('/:id/read', requireAuth, markOneRead)
router.delete('/:id', requireAuth, deleteNotification)

export default router
