import { Request, Response }  from 'express'

import { Todo } from '../models/todo'
import { User } from '../models/user'

const getTodoByUser = async(req: Request, res: Response) => {
    const { id } = req.params

    try {
        const user = await User.findOne({_id: id})
        if(!user) res.status(404).json({message: 'User not found'})
        const todos = await Todo.find({owner: user?._id})
        return res.status(200).json({message: 'Todos found', todos})
    } catch (error: any) {
        res.status(500).json({message: 'Internal server error', error})
    }
}

const addTodo = async(req: Request, res: Response) => {
    const { title, note, dueDate } = req.body
    const { id } = req.params

    if(!title) return res.status(400).json({message: 'Title is a required field'})
    if(!note) return res.status(400).json({message: 'Note is a required field'})
    if(!dueDate) return res.status(400).json({message: 'Due date is a required field'})

    try {
        const user = await User.findOne({_id: id})
        if(!user) res.status(404).json({message: 'User not found'})
        const newTodo = new Todo({title, note, dueDate, isDone: false, author: user?.username})
        const todo = await newTodo.save()
        if(!todo) res.status(500).json({message: 'Unable to add todo. Please try again'})
        return res.status(201).json({message: 'Todo added'})
    } catch (error: any) {
        res.status(500).json({message: 'Internal server error', error})
    }
}

const updateTodo = async(req: Request, res: Response) => {
    const { id, title, note, dueDate, isDone } = req.body

    if(!title) return res.status(400).json({message: 'Title is a required field'})
    if(!note) return res.status(400).json({message: 'Note is a required field'})
    if(!dueDate) return res.status(400).json({message: 'Due date is a required field'})

    try {
        const todo = await Todo.findOne({_id: id})
        if(!todo) res.status(404).json({message: 'Todo not found'})
        const updates = { title, note, dueDate, isDone }
        const updatedTodo = await Todo.findOneAndUpdate({_id: id}, {$set: updates}, {new: true})
        if(!updatedTodo) return res.status(500).json({message: 'Unable to update todo. Please try again'})
        return res.status(201).json({message: 'Todo updated'})
    } catch (error: any) {
        res.status(500).json({message: 'Internal server error', error})
    }
}

const deleteTodo = async(req: Request, res: Response) => {
    const { id } = req.params

    try {
        const todo = await Todo.findOneAndDelete({_id: id})
        if(!todo) return res.status(404).json({message: 'Todo not found'})
        return res.status(200).json({message: 'Todo deleted'})
    } catch (error: any) {
        res.status(500).json({message: 'Internal server error', error})
    }
}

export { addTodo, deleteTodo, getTodoByUser, updateTodo }