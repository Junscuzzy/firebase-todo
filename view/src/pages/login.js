import React, { useReducer } from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'

import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
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
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 10,
  },
  progess: {
    position: 'absolute',
  },
}))

function Login(props) {
  const classes = useStyles()
  const initialState = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  }

  const [{ email, password, errors, loading }, dispatch] = useReducer(
    (state, action) => {
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
    },
    initialState,
  )

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
      .post('/login', { email, password })
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
          Login
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            helperText={errors.email}
            error={!!errors.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
            disabled={loading || !email || !password}
          >
            Sign In
            {loading && (
              <CircularProgress size={30} className={classes.progess} />
            )}
          </Button>
          <Grid container>
            <Grid item>
              <Link href="signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          {errors.general && (
            <Typography variant="body2" className={classes.customError}>
              {errors.general}
            </Typography>
          )}
        </form>
      </div>
    </Container>
  )
}

export default Login
