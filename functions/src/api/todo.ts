/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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

      res.status(200).json({ todos })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

export const postOneTodo = (req: Request, res: Response) => {
  if (req.body.body.trim() === '') {
    res.status(400).json({ body: 'Must not be empty' })
  }

  if (req.body.title.trim() === '') {
    res.status(400).json({ title: 'Must not be empty' })
  }

  const newTodoItem: Omit<Todo, 'id'> = {
    title: req.body.title,
    body: req.body.body,
    createdAt: new Date(),
  }

  db.collection('todos')
    .add(newTodoItem)
    .then(doc => {
      res.status(201).json({ ...newTodoItem, id: doc.id })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: 'Something went wrong' })
    })
}

export const deleteTodo = (req: Request, res: Response) => {
  const document = db.doc(`/todos/${req.params.todoId}`)
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        res.status(404).json({ error: 'Todo not found' })
      }
      return document.delete()
    })
    .then(() => {
      res.status(200).json({ message: 'Delete successfully' })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err.code })
    })
}

export const editTodo = (req: Request, res: Response) => {
  if (req.body.todoId || req.body.createdAt) {
    res.status(403).json({ message: 'Not allowed to edit' })
  }

  const document = db.collection('todos').doc(`${req.params.todoId}`)

  document
    .update(req.body)
    .then(() => {
      res.status(200).json({ message: 'Updated successfully' })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err.code })
    })
}
