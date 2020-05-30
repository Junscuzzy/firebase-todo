import * as functions from 'firebase-functions'
import * as express from 'express'

import { getAllTodos, postOneTodo, deleteTodo, editTodo } from './api/todo'
import { loginUser, signUpUser } from './api/user'

const app = express()

app.get('/todos', getAllTodos)
app.post('/todo', postOneTodo)
app.put('/todo/:todoId', editTodo)
app.delete('/todo/:todoId', deleteTodo)

app.post('/login', loginUser)
app.post('/signup', signUpUser)

export const api = functions.https.onRequest(app)
