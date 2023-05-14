import { Router } from 'express'

import subscribe from './subscriber/subscriber.route'

const routes = () => {
  const router = Router()

  router.use('/subscription', subscribe)

  return router
}

export default routes