import RESPONSE from "./response-message"
import HTTP from "../constants/http"

const createError = (status: number, data: any) => {
    return {
        status: data[0].status,
        message: data[0].message,
        data: data[0].data,
        stack: new Error().stack,
        statusCode: status
    }
}

createError.InternalServerError = (data: any) => {
    createError(HTTP.SERVER_ERROR, {
        status: RESPONSE.ERROR,
        message: data.message || "Internal server error",
        data,
        stack: process.env.NODE_ENV === "development" ? new Error().stack : undefined,
    })
}

export default createError