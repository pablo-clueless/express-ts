import hbs from 'nodemailer-express-handlebars'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'

import { MailOptions } from '../types'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

dotenv.config()

const USER = <string> process.env.SMTP_USERNAME
const PASS = <string> process.env.SMTP_PASSWORD

const hbsConfig = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: path.join(__dirname, '../templates/'),
        layoutsDir: path.join(__dirname, '../templates/'),
        defaultLayout: '',
    },
    viewPath: path.join(__dirname, '../templates/'),
    extName: '.hbs'
}

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
        user: 'okunolaosamson@gmail.com',
        pass: 'ttblrlozntdduvff'
    }
})