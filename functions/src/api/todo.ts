/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response } from 'express'

import { db } from '../utils/admin'
import { Todo } from '../interfaces'

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const data = await db.collection('todos').orderBy('createdAt', 'desc').get()

    const todos: Todo[] = data.docs.map(doc => {
      const { title, body, createdAt } = doc.data()
      return { id: doc.id, title, body, createdAt }
    })

    res.status(200).json({ todos })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.code })
  }
}

export const postOneTodo = async (req: Request, res: Response) => {
  if (req.body.body.trim() === '') {
    res.status(400).json({ body: 'Must not be empty' })
  }

  if (req.body.title.trim() === '') {
    res.status(400).json({ title: 'Must not be empty' })
  }

  const newTodoItem: Omit<Todo, 'id'> = {
    title: req.body.title,
    body: req.body.body,
    createdAt: new Date().toISOString(),
  }

  try {
    const doc = await db.collection('todos').add(newTodoItem)
    res.status(201).json({ ...newTodoItem, id: doc.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const document = await db.doc(`/todos/${req.params.todoId}`)
    const doc = await document.get()

    if (!doc.exists) {
      res.status(404).json({ error: 'Todo not found' })
    }
    await document.delete()
    res.status(200).json({ message: 'Delete successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.code })
  }
}

export const editTodo = async (req: Request, res: Response) => {
  if (req.body.todoId || req.body.createdAt) {
    res.status(403).json({ message: 'Not allowed to edit' })
  }

  try {
    const document = await db.collection('todos').doc(`${req.params.todoId}`)
    await document.update(req.body)
    res.status(200).json({ message: 'Updated successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.code })
  }
}
