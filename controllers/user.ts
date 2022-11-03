import { NextFunction, Request, Response } from 'express'
import validator from 'validator'
import jwt, { Secret } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

import { transporter } from '../utils/mailer'
import { MailOptions } from '../types'
import { User } from '../models/user'
import { CustomRequest } from '../interfaces'

dotenv.config()
const secret: Secret = <string> process.env.SECRET

const signin = async(req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({email})
        if(!user) return res.status(404).json({message: 'User not found. Please try signing up'})
        if(!user.isVerified) return res.status(400).json({message: 'Email not validated. Please verify your email.'})
        const isPasswordValid = bcrypt.compare(password, user.password)
        if(!isPasswordValid) return res.status(400).json({message: 'Invalid password.'})
        const data = {id: user._id, fullName: user.fullName, username: user.username, email: user.email}
        const token = jwt.sign({id: user._id.toString()}, secret, {expiresIn: '30d'})
        return res.status(200).json({message: 'Signin successful.', data, token})
    } catch (error: any) {
        return res.send({code: 500, message: 'Internal server error.'})
    }
}

const signup = async(req: Request, res: Response, next: NextFunction) => {
    const { fullName, username, email, password } = req.body
    
    if(!fullName) return res.status(400).json({message: 'Name is required.'})
    if(!username) res.status(400).json({message: 'Username is required.'})
    if(!email || !validator.isEmail(email)) res.status(400).json({message: 'Email is empty or invalid.'})
    if(!password || !validator.isStrongPassword(password)) res.status(400).json({message: 'Password is empty or invalid.'})

    try {
        const isEmailInUse = await User.findOne({email})
        const isUsernameInUse = await User.findOne({username})
        if(isEmailInUse || isUsernameInUse) return res.status(409).json({message: 'This user exists already, try signing in instead.'})
                
        const saltRounds = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const user = new User({fullName, username, email: email.toLowerCase(), password: hashedPassword})
        user.save((err) => {
            if(err) return res.status(500).json({message: `An error occured while creating user.`, err})
        })
        const token = jwt.sign({id: user._id.toString()}, secret, {expiresIn: '15 mins'})
        const host = req.get('host')
        const link = `https://${host}/verify/?token=${token}`
        const mailOptions: MailOptions = {
            to: email,
            from: 'contact@theteam.com',
            subject: 'Please verify your email',
            html: `Hello ${username},
            <br>
            Please click the link below to verify your email address.
            <br>
            <a href="${link}">verify email</a>
            <br>
            Or paste the link below in your browser
            <a href="${link}">${link}</a>
            <br>
            Kind regards,
            The Team.
            `,
        }
        transporter.sendMail(mailOptions, (err: Error | null, info) => {
            if(err) return res.status(500).json({message: 'An error occured', err})
            return res.status(201).json({message: 'A verification link has been sent to your email'})
        })
    } catch (error: any) {
        return res.send({code: 500, message: 'Internal server error.'})
    }
}

const verifyEmail = async(req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params

    if(!token) return res.status(400).json({message: 'No token provided. Please check the link and retry.'})
    const userId = jwt.verify(token, secret, (err: Error | null, decoded: any) => {
        if(err) return res.status(401).json({message: 'User is unauthorized'});
        return (req as CustomRequest).userId = decoded.id
    })
    try {
        const user = await User.findOne({_id: userId})
        if(!user) return res.status(404).json({message: 'User not found. Please try signing up'})
        if(user.isVerified) return res.status(200).json({message: 'You are already verified. Please, signin to continue.'})
        user.isVerified = true
        user.save((err) => {
            if(err) return res.status(500).json({message: `An error occured while creating user.`, err})
            return res.status(200).json({message: 'Your account has been successfully verified. Signin to continue.'})
        })
    } catch (error: any) {
        return res.send({code: 500, message: 'Internal server error.'})
    }
}

const resendVerification = async(req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body

    try {
        const user = await User.findOne({email})
        if(!user) return res.status(404).json({message: 'User not found. Please try signing up'})
        if(user.isVerified) return res.status(200).json({message: 'You are already verified. Please, signin to continue.'})
        const token = jwt.sign({id: user._id.toString()}, secret, {expiresIn: '15 mins'})
        const host = req.get('host')
        const link = `https://${host}/verify/?token=${token}`
        const mailOptions = {
            to: email,
            subject: 'Please verify your email',
            html: `Hello ${user.username},
            <br>
            Please click the link below to verify your email address.
            <br>
            <a href="${link}">click here verify email</a>
            <br>
            Or paste the link below in your browser
            <a href="${link}">${link}</a>
            <br>
            Kind regards,
            The Team.
            `
        }
        transporter.sendMail(mailOptions, (err: Error | null, info) => {
            if(err) return res.status(500).json({message: 'An error occured', err})
            return res.status(201).json({message: 'A verification link has been sent to your email'})
        })
    } catch (error: any) {
        return res.send({code: 500, message: 'Internal server error.'})
    }
}

const passwordReset = async(req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body
    const { id } = req.params

    try {
        const user = await User.findOne({_id: id})
        if(!user) return res.status(404).json({message: 'User not found.'})
        const updatedUser = await User.findOneAndUpdate({_id: id}, {$set: {password: password}}, {new: true})
        if(!updatedUser) return res.status(500).json({message: 'Unable to change password. Please try again.'})
        return res.status(200).json({message: 'Password reset successful.'})
    } catch (error: any) {
        return res.send({code: 500, message: 'Internal server error.'})
    }
}

export { passwordReset, resendVerification, signin, signup, verifyEmail }