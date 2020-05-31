import * as functions from 'firebase-functions'
import * as express from 'express'

import { getAllTodos, postOneTodo, deleteTodo, editTodo } from './api/todo'
import { loginUser, signUpUser, uploadProfilePhoto } from './api/user'
import auth from './utils/auth'

const app = express()

app.get('/todos', getAllTodos)
app.post('/todo', postOneTodo)
app.put('/todo/:todoId', editTodo)
app.delete('/todo/:todoId', deleteTodo)

app.post('/login', loginUser)
app.post('/signup', signUpUser)
app.post('/user/image', auth, uploadProfilePhoto)

export const api = functions.https.onRequest(app)
