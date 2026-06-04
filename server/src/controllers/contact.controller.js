import { sendContactEmail } from '../services/emailService.js'
import { ok, badRequest } from '../utils/response.js'

export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name?.trim()) return badRequest(res, 'Name is required.')
    if (!email?.trim() || !email.includes('@')) return badRequest(res, 'A valid email is required.')
    if (!message?.trim() || message.trim().length < 10) {
      return badRequest(res, 'Message must be at least 10 characters long.')
    }

    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || '',
      message: message.trim(),
    })

    return ok(res, {}, 'Your message has been sent successfully!')
  } catch (err) {
    next(err)
  }
}
