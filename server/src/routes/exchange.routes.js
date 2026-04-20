import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  getMyExchanges, proposeExchange, getExchange,
  acceptExchange, declineExchange, completeExchange,
  cancelExchange, disputeExchange,
  getMessages, sendMessage, markMessagesRead,
  uploadExchangeFile,
} from '../controllers/exchange.controller.js'
import { uploadMessageFile, handleUploadError } from '../middleware/upload.js'

const router = Router()

const proposeSchema = z.object({
  offered_skill_id: z.string().min(1),
  requested_skill_id: z.string().min(1),
})

const messageSchema = z.object({ content: z.string().min(1).max(2000) })

router.get('/', requireAuth, getMyExchanges)
router.post('/', requireAuth, validate(proposeSchema), proposeExchange)
router.get('/:id', requireAuth, getExchange)
router.put('/:id/accept', requireAuth, acceptExchange)
router.put('/:id/decline', requireAuth, declineExchange)
router.put('/:id/complete', requireAuth, completeExchange)
router.put('/:id/cancel', requireAuth, cancelExchange)
router.put('/:id/dispute', requireAuth, disputeExchange)

// Messages nested under exchanges
router.get('/:id/messages', requireAuth, getMessages)
router.post('/:id/messages', requireAuth, validate(messageSchema), sendMessage)
router.post('/:id/files', requireAuth, (req, res, next) => {
  uploadMessageFile(req, res, (err) => {
    if (err) return handleUploadError(err, req, res, next)
    next()
  })
}, uploadExchangeFile)
router.put('/:id/messages/read', requireAuth, markMessagesRead)

export default router
