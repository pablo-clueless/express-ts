import { Schema, model } from 'mongoose'
import validator from 'validator'

import { Subscriber } from '../common/interfaces/index'

const subscriber = new Schema<Subscriber>({
  email: {type: String, required: true, unique: true, validate: (value:string) => validator.isEmail(value)},
  isSubscribed: {type: Boolean, default: true},
  subscription_date: {type: Date, default: Date.now, immutable: false}
})

export const SUBSCRIBER = model<Subscriber>('Subscriber', subscriber)