import prisma from '../config/db.js'
import { ok, notFound, forbidden, paginated } from '../utils/response.js'

export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, is_read } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where = { user_id: req.user.id, ...(type && { type }) }
    if (is_read !== undefined) {
      where.is_read = is_read === 'true'
    }
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { created_at: 'desc' }, skip, take: Number(limit) }),
      prisma.notification.count({ where }),
    ])
    return paginated(res, notifications, total, page, limit)
  } catch (err) { next(err) }
}

export const markOneRead = async (req, res, next) => {
  try {
    const notif = await prisma.notification.findUnique({ where: { id: req.params.id } })
    if (!notif) return notFound(res)
    if (notif.user_id !== req.user.id) return forbidden(res)
    await prisma.notification.update({ where: { id: req.params.id }, data: { is_read: true } })
    return ok(res, {}, 'Marked as read.')
  } catch (err) { next(err) }
}

export const markAllRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({ where: { user_id: req.user.id, is_read: false }, data: { is_read: true } })
    return ok(res, {}, 'All notifications marked as read.')
  } catch (err) { next(err) }
}

export const deleteNotification = async (req, res, next) => {
  try {
    const notif = await prisma.notification.findUnique({ where: { id: req.params.id } })
    if (!notif) return notFound(res)
    if (notif.user_id !== req.user.id) return forbidden(res)
    await prisma.notification.delete({ where: { id: req.params.id } })
    return ok(res, {}, 'Notification deleted.')
  } catch (err) { next(err) }
}
