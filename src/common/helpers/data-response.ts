export interface DataResponse {
    error: boolean
    message: string
    data?: null| string | Date | boolean | number | object | symbol | Array<any>
}