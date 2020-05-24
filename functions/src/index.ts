import * as functions from 'firebase-functions'
import * as express from 'express'

import { getAllTodos } from './api/todo'

const app = express()

app.get('/todos', getAllTodos)

export const api = functions.https.onRequest(app)
