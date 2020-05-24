import * as admin from 'firebase-admin'
import * as dotenv from 'dotenv'

dotenv.config()

const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || ''

// eslint-disable-next-line @typescript-eslint/no-var-requires
const servicesAccount = require(credentialPath)

admin.initializeApp({
  credential: admin.credential.cert(servicesAccount) || undefined,
  databaseURL: 'https://fir-todo-fe23e.firebaseio.com',
})

const db = admin.firestore()

export { db, admin }
