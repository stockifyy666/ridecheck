import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendMail(options: {
  to: string
  subject: string
  html: string
}) {
  return transporter.sendMail({
    from: `RideChecks <${process.env.GMAIL_USER}>`,
    ...options,
  })
}
