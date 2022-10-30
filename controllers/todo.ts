import { Request, Response }  from 'express'

import { Todo } from '../models/todo'

const getTodoByUser = async(req: Request, res: Response) => {}

const addTodo = async(req: Request, res: Response) => {}

const updateTodo = async(req: Request, res: Response) => {}

const deleteTodo = async(req: Request, res: Response) => {}

export { addTodo, deleteTodo, getTodoByUser, updateTodo }