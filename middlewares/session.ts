import session from 'express-session'
import dotenv from 'dotenv'

dotenv.config()
const secret = <string> process.env.SECRET

export const sessionMiddleware = session({
    secret,
    resave: false,
    saveUninitialized: false,
})