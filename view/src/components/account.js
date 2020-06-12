import React, { useReducer, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Button,
  Grid,
  TextField,
} from '@material-ui/core'

import { authMiddleWare } from '../utils/auth'

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  root: {},
  details: {
    display: 'flex',
  },
  avatar: {
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
  },
  locationText: {
    paddingLeft: '15px',
  },
  buttonProperty: {
    position: 'absolute',
    top: '50%',
  },
  uiProgess: {
    position: 'fixed',
    zIndex: '1000',
    height: '31px',
    width: '31px',
    left: '50%',
    top: '35%',
  },
  progess: {
    position: 'absolute',
  },
  uploadButton: {
    marginLeft: '8px',
    margin: theme.spacing(1),
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 10,
  },
  submitButton: {
    marginTop: '10px',
  },
}))

function Account(props) {
  const classes = useStyles()
  const initialState = {
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    profilePicture: '',
    loading: false,
    buttonLoading: false,
    imageError: '',
  }

  const [
    {
      email,
      // username,
      firstName,
      lastName,
      buttonLoading,
      loading,
      imageError,
      profilePicture,
    },
    dispatch,
  ] = useReducer((state, action) => {
    console.log({ prevState: state, props })
    const { type, payload } = action
    switch (type) {
      case 'CHANGE':
        return { ...state, ...payload }
      case 'CHANGE_IMAGE':
        return { ...state, image: payload.image }
      case 'DATA':
        return { ...state, ...payload }
      case 'LOADING':
        return { ...state, loading: payload }
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

  const handleImageChange = event => {
    dispatch({
      type: 'CHANGE_IMAGE',
      payload: {
        image: event.target.files[0],
      },
    })
  }

  const profilePictureHandler = event => {
    event.preventDefault()
    dispatch({ type: 'LOADING', payload: true })
    authMiddleWare(props.history)
    const authToken = localStorage.getItem('AuthToken')
    const formData = new FormData()
    formData.append('image', profilePicture)
    // form_data.append('content', content);
    axios.defaults.headers.common = { Authorization: `${authToken}` }

    axios
      .post('/user/image', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then(() => {
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
        if (error?.response?.status === 403) {
          this.props.history.push('/login')
        }
        dispatch({
          type: 'CHANGE',
          payload: {
            loading: false,
            imageError: 'Error in posting the data',
          },
        })
      })
  }

  const updateFormValues = event => {
    event.preventDefault()
    dispatch({ type: 'LOADING', payload: true })
    authMiddleWare(props.history)
    const authToken = localStorage.getItem('AuthToken')
    axios.defaults.headers.common = { Authorization: `${authToken}` }
    const formRequest = {
      firstName,
      lastName,
    }
    axios
      .put('/user', formRequest)
      .then(() => {
        dispatch({ type: 'CHANGE', payload: { buttonLoading: false } })
      })
      .catch(error => {
        if (error?.response?.status === 403) {
          props.history.push('/login')
        }
        console.log(error)
        dispatch({ type: 'LOADING', payload: false })
      })
  }

  useEffect(() => {
    authMiddleWare(props.history)
    const authToken = localStorage.getItem('AuthToken')
    axios.defaults.headers.common = { Authorization: `${authToken}` }
    axios
      .get('/user')
      .then(res => {
        console.log(res.data)
        dispatch({
          type: 'DATA',
          payload: {
            firstName: res.data.user.firstName,
            lastName: res.data.user.lastName,
            email: res.data.user.email,
            phoneNumber: res.data.user.phoneNumber,
            country: res.data.user.country,
            username: res.data.user.username,
            uiLoading: false,
          },
        })
      })
      .catch(error => {
        if (error?.response?.status === 403) {
          props.history.push('/login')
        }
        console.log(error)
        dispatch({ type: 'LOADING', payload: false })
      })
  }, [])

  if (loading) {
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <CircularProgress size={150} className={classes.uiProgess} />
      </main>
    )
  }

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Card {...props} className={classes.root}>
        <CardContent>
          <div className={classes.details}>
            <div>
              <Typography
                className={classes.locationText}
                gutterBottom
                variant="h4"
              >
                {firstName} {lastName}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                size="small"
                startIcon={<CloudUploadIcon />}
                className={classes.uploadButton}
                onClick={profilePictureHandler}
              >
                Upload Photo
              </Button>
              <input type="file" onChange={handleImageChange} />

              {imageError ? (
                <div className={classes.customError}>
                  {' '}
                  Wrong Image Format || Supported Format are PNG and JPG
                </div>
              ) : (
                false
              )}
            </div>
          </div>
          <div className={classes.progress} />
        </CardContent>
        <Divider />
      </Card>

      <br />
      <Card {...props} className={classes.root}>
        <form autoComplete="off" noValidate>
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="First name"
                  margin="dense"
                  name="firstName"
                  variant="outlined"
                  value={firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Last name"
                  margin="dense"
                  name="lastName"
                  variant="outlined"
                  value={lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  margin="dense"
                  name="email"
                  variant="outlined"
                  disabled={true}
                  value={email}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions />
        </form>
      </Card>
      <Button
        color="primary"
        variant="contained"
        type="submit"
        className={classes.submitButton}
        onClick={updateFormValues}
        disabled={buttonLoading || !firstName || !lastName}
      >
        Save details
        {buttonLoading && (
          <CircularProgress size={30} className={classes.progess} />
        )}
      </Button>
    </main>
  )
}

export default Account
