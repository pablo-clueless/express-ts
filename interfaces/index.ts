import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export interface IUser {
    fullName: string
    username: string
    email: string
    password: string
    todos: Array<ITodo>
    createdOn: Date
}

export interface ITodo {
    title: string
    note: string
    dueDate: Date
    isDone: boolean
    owner: IUser
    createdOn: Date
}

export interface CustomRequest extends Request {
    token: string | JwtPayload
    userId: string
}