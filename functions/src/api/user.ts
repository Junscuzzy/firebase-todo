/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import firebase from 'firebase'
import { Request, Response } from 'express'
import BusBoy from 'busboy'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'

import { db, admin } from '../utils/admin'
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
      userId: data.user.uid,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteImage = async (imageName: string) => {
  const bucket = admin.storage().bucket()
  const path = `${imageName}`
  return await bucket.file(path).delete()
}

export const uploadProfilePhoto = (req: Request, res: Response) => {
  const username = req.user?.username
  if (typeof username === 'undefined') {
    return res.status(400).json({ error: 'Must be authenticated' })
  }

  const busboy = new BusBoy({ headers: req.headers })

  let imageFileName = ''
  let imageToBeUploaded = { filePath: '', mimetype: '' }

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      return res.status(400).json({ error: 'Wrong file type submited' })
    }

    const imageExtension = filename.split('.')[filename.split('.').length - 1]
    imageFileName = `${username}.${imageExtension}`
    const filePath = path.join(os.tmpdir(), imageFileName)
    imageToBeUploaded = { filePath, mimetype }

    return file.pipe(fs.createWriteStream(filePath))
  })

  if (imageFileName && imageFileName.trim() !== '') {
    deleteImage(imageFileName)
  }

  busboy.on('finish', async () => {
    try {
      const bucket = admin.storage().bucket(config.storageBucket)
      await bucket.upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
      await db.doc(`/users/${username}`).update({
        imageUrl,
      })
      res.json({ message: 'Image uploaded successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: error.code })
    }
  })

  // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
  // a callback when it's finished.
  return busboy.end(req.rawBody)
}

export const getUserDetail = async (req: Request, res: Response) => {
  try {
    const doc = await db.doc(`/users/${req.user?.username}`).get()
    if (doc.exists) {
      const user = doc.data()
      res.status(200).json({ user })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.code })
  }
}

export const updateUserDetail = async (req: Request, res: Response) => {
  try {
    const doc = await db.doc(`/users/${req.user?.username}`)
    if (req.body.username && req.body.username.trim !== '') {
      return res.status(400).json({ message: "You can't edit the username" })
    }

    await doc.update(req.body)

    return res.status(201).json({ message: 'Updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Cannot Update the value' })
  }
}
