import express, { Router, RouterOptions } from 'express'

import { passwordReset, signin, signup } from '../controllers/user'
import { verify } from '../middlewares/auth'

const router = express.Router()