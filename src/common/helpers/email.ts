import { createTransport } from 'nodemailer'
import dotenv from 'dotenv'

import { KEYS } from '../config'

dotenv.config()

interface MailOptions {
    to: string
    subject: string
    html: string
}

const mailService = () => {
    const transporter = createTransport({
        host: KEYS.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            pass: KEYS.SMTP_PASS,
            user: KEYS.SMTP_USER
        }
    })

    const sendMail = async(mailOptions:MailOptions) => {
        try {
            return await transporter.sendMail({
                from: KEYS.SMTP_USER,
                to: mailOptions.to,
                subject: mailOptions.subject,
                html: mailOptions.html
            })
        } catch (error:any) {
            throw new Error(error)
        }
    }

    return sendMail
}

export default mailService