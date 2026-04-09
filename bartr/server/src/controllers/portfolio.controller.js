import prisma from '../config/db.js'
import { ok, created, notFound, forbidden } from '../utils/response.js'

export const getUserPortfolio = async (req, res, next) => {
  try {
    const items = await prisma.portfolio.findMany({
      where: { user_id: req.params.userId },
      orderBy: { created_at: 'desc' },
    })
    return ok(res, { items })
  } catch (err) { next(err) }
}

export const createPortfolioItem = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' })
    const { title, description, tags } = req.body
    const item = await prisma.portfolio.create({
      data: {
        user_id: req.user.id,
        title,
        description,
        file_url: req.file.path,
        file_type: req.file.mimetype,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      },
    })
    return created(res, { item }, 'Portfolio item created.')
  } catch (err) { next(err) }
}

export const updatePortfolioItem = async (req, res, next) => {
  try {
    const item = await prisma.portfolio.findUnique({ where: { id: req.params.id } })
    if (!item) return notFound(res)
    if (item.user_id !== req.user.id) return forbidden(res)
    const { title, description, tags } = req.body
    const updated = await prisma.portfolio.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : undefined,
      },
    })
    return ok(res, { item: updated }, 'Portfolio item updated.')
  } catch (err) { next(err) }
}

export const deletePortfolioItem = async (req, res, next) => {
  try {
    const item = await prisma.portfolio.findUnique({ where: { id: req.params.id } })
    if (!item) return notFound(res)
    if (item.user_id !== req.user.id) return forbidden(res)
    await prisma.portfolio.delete({ where: { id: req.params.id } })
    return ok(res, {}, 'Portfolio item deleted.')
  } catch (err) { next(err) }
}
