/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response, NextFunction } from 'express'

import { admin, db } from './admin'
import { User } from '../interfaces'

export default async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Get token
  let idToken: string
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1]
  } else {
    console.error('No token found')
    return res.status(403).json({ error: 'Unauthorized' })
  }

  // Verify
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const data = await db
      .collection('users')
      .where('userId', '==', decodedToken.user_id)
      .limit(1)
      .get()

    const user = {
      ...(decodedToken as admin.auth.DecodedIdToken),
      ...(data.docs[0].data() as User),
    }

    // Save user in Request object
    req.user = user
    return next()
  } catch (error) {
    console.error('Error while verifying token', error)
    res.status(403).json(error)
  }
}
