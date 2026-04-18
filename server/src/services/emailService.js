import nodemailer from 'nodemailer'

let transporter

const getTransporter = () => {
  if (transporter) return transporter

  if (process.env.RESEND_API_KEY) {
    transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    })
  } else {
    // Fallback: Mailtrap / SMTP
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return transporter
}

const FROM = process.env.EMAIL_FROM || 'Bartr <noreply@bartr.dev>'
const BASE_URL = process.env.CLIENT_URL || 'http://localhost:5173'

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'DM Sans', Arial, sans-serif; background: #f7f6f2; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #0f0f0f; padding: 28px 32px; }
    .logo { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
    .logo span { background: #f5c842; color: #0f0f0f; padding: 2px 8px; border-radius: 6px; margin-right: 6px; }
    .body { padding: 32px; color: #1a1a1a; line-height: 1.6; }
    .body h2 { font-size: 22px; font-weight: 700; margin: 0 0 12px; }
    .body p { margin: 0 0 16px; color: #555; font-size: 15px; }
    .btn { display: inline-block; background: #0f0f0f; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 100px; font-weight: 600; font-size: 14px; margin: 8px 0 20px; }
    .footer { padding: 20px 32px; border-top: 1px solid #f0efeb; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo"><span>B</span>Bartr</div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">© ${new Date().getFullYear()} Bartr. Student skill exchange platform.<br>You're receiving this because you have an account on Bartr.</div>
  </div>
</body>
</html>
`

export const sendVerificationEmail = async (user, token) => {
  const link = `${BASE_URL}/verify-email?token=${token}`
  await getTransporter().sendMail({
    from: FROM,
    to: user.email,
    subject: 'Verify your Bartr account',
    html: baseTemplate(`
      <h2>Welcome to Bartr, ${user.full_name.split(' ')[0]}! 👋</h2>
      <p>Thanks for signing up. Click the button below to verify your email address and start exchanging skills.</p>
      <a href="${link}" class="btn">Verify my email →</a>
      <p>This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
    `),
  })
}

export const sendPasswordResetEmail = async (user, token) => {
  const link = `${BASE_URL}/reset-password?token=${token}`
  await getTransporter().sendMail({
    from: FROM,
    to: user.email,
    subject: 'Reset your Bartr password',
    html: baseTemplate(`
      <h2>Reset your password</h2>
      <p>We received a request to reset your password for <strong>${user.email}</strong>.</p>
      <a href="${link}" class="btn">Reset password →</a>
      <p>This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
    `),
  })
}

export const sendExchangeProposalEmail = async (recipient, proposer, exchange) => {
  const link = `${BASE_URL}/exchanges/${exchange.id}`
  await getTransporter().sendMail({
    from: FROM,
    to: recipient.email,
    subject: `${proposer.full_name} wants to exchange skills with you!`,
    html: baseTemplate(`
      <h2>New exchange proposal! 🤝</h2>
      <p><strong>${proposer.full_name}</strong> from ${proposer.university || 'a university near you'} wants to exchange skills with you on Bartr.</p>
      <p>They're offering their skills in exchange for yours. Head over to Bartr to review and respond.</p>
      <a href="${link}" class="btn">View proposal →</a>
    `),
  })
}

export const sendExchangeAcceptedEmail = async (recipient, acceptedBy) => {
  const link = `${BASE_URL}/exchanges`
  await getTransporter().sendMail({
    from: FROM,
    to: recipient.email,
    subject: `${acceptedBy.full_name} accepted your exchange!`,
    html: baseTemplate(`
      <h2>Exchange accepted! 🎉</h2>
      <p><strong>${acceptedBy.full_name}</strong> has accepted your skill exchange proposal. You can now start chatting and planning your sessions.</p>
      <a href="${link}" class="btn">Go to my exchanges →</a>
    `),
  })
}

export const sendExchangeCompletedEmail = async (recipient, partner) => {
  const link = `${BASE_URL}/exchanges`
  await getTransporter().sendMail({
    from: FROM,
    to: recipient.email,
    subject: 'Exchange completed — leave a review!',
    html: baseTemplate(`
      <h2>Exchange complete! ⭐</h2>
      <p>Your skill exchange with <strong>${partner.full_name}</strong> has been marked as complete. Don't forget to leave a review to help build their reputation!</p>
      <a href="${link}" class="btn">Leave a review →</a>
    `),
  })
}

export const sendNewReviewEmail = async (recipient, reviewer, rating) => {
  const link = `${BASE_URL}/profile/${recipient.username}`
  await getTransporter().sendMail({
    from: FROM,
    to: recipient.email,
    subject: `${reviewer.full_name} left you a ${rating}-star review!`,
    html: baseTemplate(`
      <h2>New review received! ${'⭐'.repeat(rating)}</h2>
      <p><strong>${reviewer.full_name}</strong> just left you a ${rating}-star review on Bartr. Check it out on your profile!</p>
      <a href="${link}" class="btn">View my profile →</a>
    `),
  })
}
