/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response } from 'express'
import * as firebase from 'firebase'

import { db } from '../utils/admin'
import config from '../utils/config'
import { validateLoginData, validateSignUpData } from '../utils/validators'

firebase.initializeApp(config)

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const { valid, errors } = validateLoginData({ email, password })

  if (!valid) {
    res.status(400).json(errors)
  }

  try {
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
    // Remember this token expires in 60 minutes.
    const token = await data.user?.getIdToken()
    res.status(200).json({ token })
  } catch (error) {
    console.log(error)
    res.status(403).json({ general: 'wrong credentials, please try again' })
  }
}

export const signUpUser = async (req: Request, res: Response) => {
  const { valid, errors } = validateSignUpData(req.body)

  if (!valid) {
    res.status(400).json(errors)
  }

  const { firstName, lastName, username, password, email } = req.body

  try {
    const document = await db.doc(`/users/${username}`).get()

    if (document.exists) {
      res.status(400).json({ username: 'this username is already taken' })
    }

    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)

    // Remember this token expires in 60 minutes.
    const token = await data.user?.getIdToken()

    if (!token || !data.user?.uid) {
      throw new Error('Cannot get Token')
    }

    const userCredentials = {
      firstName,
      lastName,
      username,
      email,
      createdAt: new Date().toISOString(),
      usedId: data.user.uid,
    }

    await db.doc(`/users/${username}`).set(userCredentials)
    res.status(201).json({ token })
  } catch (error) {
    console.log(error)
    if (error.code === 'auth/email-already-in-use') {
      res.status(400).json({ email: 'Email already in use' })
    } else {
      res
        .status(500)
        .json({ general: 'Something went wrong, please try again' })
    }
  }
}
