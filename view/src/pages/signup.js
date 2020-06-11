import React, { useReducer } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'

import axios from 'axios'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  progess: {
    position: 'absolute',
  },
}))

function Signup(props) {
  const classes = useStyles()
  const initialState = {
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    errors: [],
    loading: false,
  }

  const [
    {
      email,
      password,
      confirmPassword,
      username,
      firstName,
      lastName,
      errors,
      loading,
    },
    dispatch,
  ] = useReducer((state, action) => {
    console.log({ prevState: state, props })
    const { type, payload } = action
    switch (type) {
      case 'CHANGE':
        return { ...state, ...payload }

      case 'LOADING':
        return { ...state, loading: payload }
      case 'ERRORS':
        return { ...state, errors: payload }
      default:
        return state
    }
  }, initialState)

  const handleChange = event => {
    dispatch({
      type: 'CHANGE',
      payload: {
        [event.target.name]: event.target.value,
      },
    })
  }

  const handleSubmit = event => {
    event.preventDefault()
    dispatch({ type: 'LOADING', payload: true })

    axios
      .post('/signup', {
        email,
        password,
        username,
        firstName,
        lastName,
        confirmPassword,
      })
      .then(res => {
        localStorage.setItem('AuthToken', `Bearer ${res.data.token}`)
        dispatch({ type: 'LOADING', payload: false })
        props.history.push('/')
      })
      .catch(error => {
        dispatch({ type: 'ERRORS', payload: error.response.data })
        dispatch({ type: 'LOADING', payload: false })
      })
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="firstName"
                helperText={errors.firstName}
                error={!!errors.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lastName"
                helperText={errors.lastName}
                error={!!errors.lastName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                autoComplete="username"
                helperText={errors.username}
                error={!!errors.username}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                helperText={errors.email}
                error={!!errors.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText={errors.password}
                error={!!errors.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
            disabled={
              loading ||
              !email ||
              !password ||
              !firstName ||
              !lastName ||
              !username
            }
          >
            Sign Up
            {loading && (
              <CircularProgress size={30} className={classes.progess} />
            )}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

export default Signup
