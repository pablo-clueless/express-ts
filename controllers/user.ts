import { Request, Response } from 'express'
import validator from 'validator'
import jwt, { Secret } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

import { User } from '../models/user'

dotenv.config()
const secret: Secret = <string> process.env.SECRET

const signin = async(req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({email}).select('-password')
        if(!user) return res.status(404).json({message: 'user not found'})
        const isPasswordValid = bcrypt.compare(password, user.password)
        if(!isPasswordValid) return res.status(400).json({message: 'Invalid password'})
        const token = jwt.sign({id: user._id.toString()}, secret, {expiresIn: '30d'})
        res.status(200).json({message: 'Signin successful', user, token})
    } catch (error: any) {
        res.status(500).json({message: 'Internal server error', error})
    }
}

const signup = async(req: Request, res: Response) => {
    const { fullName, username, email, password } = req.body

    if(!fullName) return res.status(400).json({message: 'Name is required'})
    if(!username) res.status(400).json({message: 'Username is required'})
    if(!email || !validator.isEmail(email)) res.status(400).json({message: 'Email is empty or invalid'})
    if(!password || !validator.isStrongPassword(password)) res.status(400).json({message: 'Password is empty or invalid'})
    
    try {
        const isEmailInUse = await User.findOne({email})
        const isUsernameInUse = await User.findOne({username})
        if(isEmailInUse || isUsernameInUse) return res.status(400).json({message: 'This user exists already, try logging instead.'})
        
        const saltRounds = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        await User.create({fullName, username, email, password: hashedPassword}, (err: any) => {
            if(err) return res.status(500).json({message: `An error occured, couldn't create user`})
            res.status(201).json({message: 'User created'})
        })
    } catch (error: any) {
        res.status(500).json({message: 'Internal server error', error})
    }
}

const passwordReset = async(req: Request, res: Response) => {
    const { password } = req.body
    const { id } = req.params

    try {
        const user = await User.findOne({_id: id})
        if(!user) return res.status(404).json({message: 'User not found'})
        const updatedUser = await User.findOneAndUpdate({_id: id}, {$set: {password: password}}, {new: true})
        if(!updatedUser) return res.status(500).json({message: 'Unable to change password. Please try again'})
        return res.status(200).json({message: 'Password reset successful'})
    } catch (error: any) {
        res.status(500).json({message: 'Internal server error', error})
    }
}

export { passwordReset, signin, signup }