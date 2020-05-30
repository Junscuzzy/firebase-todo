// For Login
export interface UserBase {
  email: string
  password: string
}

// Used in validators
export interface ErrorObject<T> {
  errors: Partial<T>
  valid: boolean
}

// Sign-up form data
export type UserFormData = Partial<User> & { confirmPassword?: string }

/**
 * Database Models
 */
export interface Todo {
  id: string
  title: string
  body: string
  createdAt: string
}

export interface User extends UserBase {
  username: string
  firstName: string
  lastName: string
}
