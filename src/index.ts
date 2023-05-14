import mongoose from 'mongoose'
import http from 'node:http'
import dotenv from 'dotenv'

import { KEYS } from './common/config'
import getApp from './server'

const app = getApp()
const server = http.createServer(app)

dotenv.config()

mongoose.connect(KEYS.MONGO_URI)
mongoose.set('strictQuery', false)
const db = mongoose.connection
db.once('open', () => console.log('Successfully connected to MongoDB'))
db.on('error', console.error.bind(console, 'connection error: '))

server.listen(KEYS.PORT, () => {
  console.log(`Server running on port: ${KEYS.PORT}`)
})