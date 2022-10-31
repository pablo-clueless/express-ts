
class User {
    fullName: string = ''
    username: string = ''
    email: string = ''
    password: string = ''
    todos: Array<Todo> = []
    createdOn: string = ''
}

class Todo {
    title: string = ''
    note: string = ''
    isDone: boolean = false
    author: object = User
    createdOn: string = ''
}