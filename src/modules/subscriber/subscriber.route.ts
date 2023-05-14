import { Router } from 'express'

import { subscribeController, unsubscribeController } from './subscriber.controller'

const router = Router()

router.post('/subscribe', subscribeController)

router.put('/unsubscribe', unsubscribeController)

export default router