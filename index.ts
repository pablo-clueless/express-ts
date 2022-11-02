import express, { Express, Request, Response } from 'express'
import { ExtendedError } from 'socket.io/dist/namespace'
import { Server, Socket } from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import http from 'http'
import cors from 'cors'

import { sessionMiddleware } from './middlewares/session'
import { todoRouter } from './routes/todo'
import { userRouter } from './routes/user'
declare module 'express-session' {
    interface SessionData {
        user: User
    }
}

const app: Express = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('common'))
app.use(sessionMiddleware)
app.set('io', io)

// mongodb connection
mongoose.connect(<string> process.env.MONGO_URI)
const db = mongoose.connection
db.once('open', () => console.log('Successfully connected to MongoDB'))
db.on('error', console.error.bind(console, 'Connection error: '))

// socket.io connection
const wrap = (middleware: any) => (socket: Socket, next: (err?: ExtendedError | undefined) => void) => middleware(socket.request, {}, next)
io.use(wrap(sessionMiddleware))
io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id} at ${new Date().toLocaleString()}`)
})

app.get('/', (req: Request, res: Response) => res.status(200).json({message: 'Hello from Express.ts'}))

app.use('/todo', todoRouter)
app.use('/user', userRouter)

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))