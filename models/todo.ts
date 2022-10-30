import { Schema, Types, model } from 'mongoose'

import { ITodo } from '../interfaces'

const todoSchema = new Schema<ITodo>({
    title: { type: String, required: true },
    note: { type: String, required: true },
    isDone: { type: Boolean, required: true, default: false },
    author: { type: Types.ObjectId, ref: 'User' },
    createdOn: { type: Date, default: Date.now }
})

export const Todo = model<ITodo>('Todo', todoSchema)