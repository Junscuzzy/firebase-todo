import * as functions from 'firebase-functions'
import * as express from 'express'

import { getAllTodos, postOneTodo, deleteTodo, editTodo } from './api/todo'

const app = express()

app.get('/todos', getAllTodos)
app.post('/todo', postOneTodo)
app.put('/todo/:todoId', editTodo)
app.delete('/todo/:todoId', deleteTodo)

export const api = functions.https.onRequest(app)
