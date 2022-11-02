import express from 'express'

import { passwordReset, signin, signup, verifyEmail } from '../controllers/user'

const router = express.Router()

router.post('/signup', signup)

router.post('/signin', signin)

router.get('/verify/:token', verifyEmail)

router.post('/password-reset', passwordReset)

export { router as userRouter }