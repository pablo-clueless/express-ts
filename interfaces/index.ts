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
    isDone: boolean
    author: IUser
    createdOn: Date
}