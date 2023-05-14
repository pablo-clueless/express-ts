import { NextFunction, Request, Response } from 'express'

import { DataResponse, RESPONSE, createError, createResponse } from '../../common/helpers'
import { subscribeService, unsubscribeService} from './subscriber.service'
import { SubscribeDto } from './subscriber.dto'
import { HTTP } from '../../common/constants'

const subscribeController = async(req:Request, res:Response, next:NextFunction) => {
  try {
    const payload:SubscribeDto = { email: req.body.email }
    const {error, message, data}:DataResponse = await subscribeService(payload)
    if(error) {
      return next(createError(HTTP.BAD_REQUEST, [{
        status: RESPONSE.ERROR,
        message,
        statusCode: data instanceof Error ? HTTP.SERVER_ERROR : HTTP.BAD_REQUEST,
        data
      }]))
    }
    return createResponse(message, data)(res, HTTP.CREATED)
  } catch (error:any) {
    console.log(error)
    return next(createError.InternalServerError(error))
  }
}

const unsubscribeController = async(req:Request, res:Response, next:NextFunction) => {
  try {
    const payload:SubscribeDto = { email: req.body.email }
    const {error, message, data}:DataResponse = await unsubscribeService(payload)
    if(error) {
      return next(createError(HTTP.BAD_REQUEST, [{
        status: RESPONSE.ERROR,
        message,
        statusCode: data instanceof Error ? HTTP.SERVER_ERROR : HTTP.BAD_REQUEST,
        data
      }]))
    }
    return createResponse(message, data)(res, HTTP.OK) 
  } catch (error:any) {
    console.log(error)
    return next(createError.InternalServerError(error))
  }
}

export {
  subscribeController,
  unsubscribeController,
}