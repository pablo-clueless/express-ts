import express, { Express, NextFunction, Request, Response, Router } from 'express'
import morgan from 'morgan'
import cors from 'cors'

import {RESPONSE, createError} from './common/helpers'
import { HTTP } from './common/constants'
import routes from './modules/routes'

const getApp = () => {
  const app:Express = express()
  app.disable('x-powered-by')

  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))
  app.use(morgan('dev'))

  app.use((_err:any, _req:any, _res:any, _:any) => {
    if(_err instanceof SyntaxError) {
      return _res.status(HTTP.BAD_REQUEST).json({
        code: HTTP.UNPROCESSABLE_ENTITY,
        status: RESPONSE.ERROR,
        message: 'Invalid JSON payload',
        data: null,
      })
    }
  })

  const apiRouter = Router()
  apiRouter.use(routes())

  apiRouter.use((_req, _res, next) => {
    next(createError(HTTP.NOT_FOUND, [{
      code: HTTP.NOT_FOUND,
      status: RESPONSE.ERROR,
      message: 'Route not found',
      data: null,
    }]))
  })

  apiRouter.use((error:any, _req:any, res:Response, _next:NextFunction) => {
    console.error(error)
    const initialError = error
    if(error.statusCode) {
      error = createError(HTTP.SERVER_ERROR, [{
        code: HTTP.SERVER_ERROR,
        status: RESPONSE.ERROR,
        message: initialError || 'Internal server error',
        data: null,
        stack: error.stack
      }])
    }
    return res.status(error.statusCode).json({
      code: error.code,
      status: error.status,
      message: error.message,
      data: error.data || null,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack
      })
    })
  })

  app.get('/', async(_req:Request, res:Response) => {
    res.send({message: 'Hello from Samson Okunola'})
  })

  app.get('/favicon.ico', express.static('public/favicon.ico'))
  
  const apiUrl = `/`

  app.use(apiUrl, apiRouter)

  return app
}

export default getApp