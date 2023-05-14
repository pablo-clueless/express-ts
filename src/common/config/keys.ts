import dotenv from "dotenv"

dotenv.config()

const KEYS = {
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    SMTP_HOST: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_USER: process.env.SMTP_USER,
}

export default KEYS