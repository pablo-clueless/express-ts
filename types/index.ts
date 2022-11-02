
export type SocketResponse = {
    message: string
    options?: NotificationOptions
}

export type NotificationOptions = {
    id?: string
    date?: Date
    isRead?: boolean
}

export type MailOptions = {
    from: string
    to: string
    subject: string
    html: string
}