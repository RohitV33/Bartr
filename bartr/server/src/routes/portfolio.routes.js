import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { uploadPortfolio, handleUploadError } from '../middleware/upload.js'
import { uploadLimiter } from '../middleware/rateLimiter.js'
import {
  getUserPortfolio, createPortfolioItem,
  updatePortfolioItem, deletePortfolioItem,
} from '../controllers/portfolio.controller.js'

const router = Router()

router.get('/user/:userId', getUserPortfolio)
router.post('/', requireAuth, uploadLimiter, (req, res, next) => {
  uploadPortfolio(req, res, (err) => {
    if (err) return handleUploadError(err, req, res, next)
    next()
  })
}, createPortfolioItem)
router.put('/:id', requireAuth, updatePortfolioItem)
router.delete('/:id', requireAuth, deletePortfolioItem)

export default router
