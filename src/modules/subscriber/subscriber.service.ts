import validator from 'validator'
import dotenv from 'dotenv'

import { DataResponse } from '../../common/helpers/data-response'
import { SUBSCRIBER } from '../../schemas/subscriber'
// import { MailService } from '../../common/helpers'
import { SubscribeDto } from './subscriber.dto'

dotenv.config()

const subscribeService = async(data:SubscribeDto) => {
  try {
    const {email} = data
    let response:DataResponse
    if(!email) {
      response = {
        error: true,
        message: 'Email is required!'
      }
      return response
    }
    if(!validator.isEmail(email)) {
      response = {
        error: true,
        message: 'Invalid email!'
      }
      return response
    }
    const isSubscribed = await SUBSCRIBER.findOne({
      email,
      isSubscribed: true,
    })
    if(isSubscribed) {
      response = {
        error: true,
        message: 'This email is subscribed already.'
      }
      return response
    }
    const newSubsciber = await SUBSCRIBER.create({email})
    response = {
      error: false,
      message: 'You have successfully subscribed to my newsletter.',
      data: newSubsciber
    }
    return response
  } catch (error:any) {
    console.log(error);
    const response: DataResponse = {
      error: true,
      message: error.message || 'Unable to subscribe at the moment. Please try again.',
      data: error
    }
    return response
  }
}

const unsubscribeService = async(data:SubscribeDto) => {
  try {
    const {email} = data
    let response:DataResponse
    if(!email) {
      response = {
        error: true,
        message: 'Email is required!'
      }
      return response
    }
    const isSubscribed = await SUBSCRIBER.findOne({email})
    if(!isSubscribed) {
      response = {
        error: true,
        message: 'This email is not subscribed.'
      }
      return response
    }
    const modifiedSubscriber = await SUBSCRIBER.findOneAndUpdate({
      isSubscribed: false,
    })
    if(!modifiedSubscriber) {
      response = {
        error: true,
        message: 'Unable to unsubscribe at the moment.'
      }
      return response
    }
    response = {
      error: false,
      message: 'You have successfully unsubscribed.',
      data: modifiedSubscriber
    }
    return response
  } catch (error:any) {
    console.log(error);
    const response: DataResponse = {
      error: true,
      message: error.message || 'Unable to unsubscribe at the moment. Please try again.',
      data: error
    }
    return response
  }
}

export {
  subscribeService,
  unsubscribeService
}