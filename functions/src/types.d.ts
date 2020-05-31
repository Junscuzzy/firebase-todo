import { User } from './interfaces'
import { admin } from './utils/admin'

declare global {
  namespace Express {
    interface Request {
      user?: User & admin.auth.DecodedIdToken
      rawBody: any
    }
  }
}
