import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import validator from 'validator'

import { User } from '../models/user'

const signin = async(req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        let user = await User.findOne({email})
        if(!user) return res.status(404).json({message: 'user not found'})
        const isPasswordValid = bcrypt.compare(password, user.password)
        if(!isPasswordValid) return res.status(400).json({message: 'Invalid password'})
        // user
        res.status(200).json({message: 'Signin successful', user})
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

export { signin, signup }