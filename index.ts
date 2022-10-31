import express, { Express, Request, Response } from 'express'
import http from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

import { sessionMiddleware } from './middlewares/session'

declare module 'express-session' {
    interface SessionData {
        user: User
    }
}

const app: Express = express()
const server = http.createServer(app)

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('common'))
app.use(sessionMiddleware)

app.get('/', (req: Request, res: Response) => res.status(200).json({message: 'Hello from Express.ts'}))

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))