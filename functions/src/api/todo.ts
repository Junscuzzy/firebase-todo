import { Request, Response } from 'express'

import { db } from '../utils/admin'

export interface Todo {
  id: string
  title: string
  body: string
  createdAt: Date
}

export const getAllTodos = (req: Request, res: Response) => {
  db.collection('todos')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      const todos: Todo[] = []

      data.forEach(doc => {
        const { id } = doc
        const { title, body, createdAt } = doc.data()
        todos.push({ id, title, body, createdAt })
      })

      return res.status(200).json({ todos })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}
