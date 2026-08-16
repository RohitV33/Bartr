import prisma from '../config/db.js'
import { emitToUser } from '../sockets/socket.js'

export const createNotification = async ({ userId, type, title, body, link }) => {
  const notification = await prisma.notification.create({
    data: { user_id: userId, type, title, body, link },
  })

  try {
    emitToUser(userId, 'notification:new', notification)
  } catch (err) {
    console.error('Failed to emit real-time notification socket event:', err.message)
  }

  return notification
}

export const notifyNewMatch = async (userId, matchedUser) => {
  return createNotification({
    userId,
    type: 'MATCH',
    title: 'New skill match!',
    body: `${matchedUser.full_name} from ${matchedUser.university || 'another university'} is a great skill match for you.`,
    link: `/profile/${matchedUser.username}`,
  })
}

export const notifyNewMessage = async (userId, senderName, exchangeId) => {
  return createNotification({
    userId,
    type: 'MESSAGE',
    title: `New message from ${senderName}`,
    body: `You have a new message in your exchange.`,
    link: `/exchanges/${exchangeId}`,
  })
}

export const notifyExchangeUpdate = async (userId, title, body, exchangeId) => {
  return createNotification({
    userId,
    type: 'EXCHANGE',
    title,
    body,
    link: `/exchanges/${exchangeId}`,
  })
}

export const notifyNewReview = async (userId, reviewerName, rating) => {
  return createNotification({
    userId,
    type: 'REVIEW',
    title: `New ${rating}-star review!`,
    body: `${reviewerName} left you a review.`,
    link: `/profile/me`,
  })
}
