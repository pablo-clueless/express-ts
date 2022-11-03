import cloudinary from 'cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

const CLOUDINARY =  cloudinary.v2

CLOUDINARY.config({
    cloud_name: '',
    api_key: '',
    api_secret: '',
    secure: true
})

const storage = multer.memoryStorage()

export const upload = multer({storage})