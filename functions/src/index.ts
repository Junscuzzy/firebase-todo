import * as functions from 'firebase-functions'
import express from 'express'

import {
  getAllTodos,
  postOneTodo,
  deleteTodo,
  editTodo,
  getOneTodo,
} from './api/todo'
import {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetail,
} from './api/user'
import auth from './utils/auth'

const app = express()

app.get('/todos', auth, getAllTodos)
app.get('/todo/:todoId', auth, getOneTodo)
app.post('/todo', auth, postOneTodo)
app.put('/todo/:todoId', auth, editTodo)
app.delete('/todo/:todoId', auth, deleteTodo)

app.post('/login', loginUser)
app.post('/signup', signUpUser)
app.post('/user/image', auth, uploadProfilePhoto)
app.get('/user', auth, getUserDetail)
app.put('/user', auth, updateUserDetail)

export const api = functions.https.onRequest(app)
