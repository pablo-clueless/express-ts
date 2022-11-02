import { Schema, Types, model } from 'mongoose'

import { IToken } from '../interfaces'

const tokenSchema = new Schema<IToken>({
    _userId: { type: Types.ObjectId, ref: 'User' },
    token: { type: String, required: true },
    expiresAt: { type: Date, default: Date.now, expires: 86400000 }
})

export const Token = model<IToken>('Token', tokenSchema)