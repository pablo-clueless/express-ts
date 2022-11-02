import express from 'express'

import { addTodo, deleteTodo, getTodoByUser, updateTodo} from '../controllers/todo'
import { verify } from '../middlewares/auth'

const router = express.Router()

router.post('/add', [verify], addTodo)

router.delete('delete/:id', [verify], deleteTodo)

router.get('get-all/:id', [verify], getTodoByUser)

router.patch('update', [verify], updateTodo)

export { router as todoRouter }