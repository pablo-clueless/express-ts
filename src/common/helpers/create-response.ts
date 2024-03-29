import { Response } from "express"

const createResponse = (message: string, data: any = [], status = "success") =>
    (res: Response, code: number) => {
        return res.status(code).json({code, status, message, data})
    }

export default createResponse