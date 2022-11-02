import { Schema, Types, model } from 'mongoose'
import validator from 'validator'

import { IUser } from '../interfaces'

const userSchema = new Schema<IUser>({
    fullName: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, validate: (value: string) => validator.isEmail(value) },
    password: { type: String, required: true, select: false },
    todos: [{ type: Types.ObjectId, ref: 'Todo' }],
    isVerified: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now }
})

export const User = model<IUser>('User', userSchema)