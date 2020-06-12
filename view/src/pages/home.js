import React, { useReducer, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

import AccountBoxIcon from '@material-ui/icons/AccountBox'
import NotesIcon from '@material-ui/icons/Notes'
import Avatar from '@material-ui/core/Avatar'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import CircularProgress from '@material-ui/core/CircularProgress'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'

import Account from '../components/account'
import Todo from '../components/todo'
import { authMiddleWare } from '../utils/auth'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  avatar: {
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
    marginTop: 20,
  },
  uiProgess: {
    position: 'fixed',
    zIndex: '1000',
    height: '31px',
    width: '31px',
    left: '50%',
    top: '35%',
  },
  toolbar: theme.mixins.toolbar,
}))

function Home(props) {
  const classes = useStyles()

  const initialState = {
    render: false,
    firstName: '',
    lastName: '',
    profilePicture: '',
    loading: true,
    imageLoading: false,
    error: '',
  }

  const [
    { render, firstName, lastName, profilePicture, loading },
    dispatch,
  ] = useReducer((state, action) => {
    console.log({ prevState: state, props })
    const { type, payload } = action
    switch (type) {
      case 'DATA':
        return { ...state, ...payload }
      case 'LOADING':
        return { ...state, loading: payload }
      case 'RENDER':
        return { ...state, render: payload }
      default:
        return state
    }
  }, initialState)

  const loadAccountPage = event => {
    dispatch({ type: 'RENDER', payload: true })
  }

  const loadTodoPage = event => {
    dispatch({ type: 'RENDER', payload: false })
  }

  const logoutHandler = () => {
    localStorage.removeItem('AuthToken')
    props.history.push('/login')
  }

  useEffect(() => {
    authMiddleWare(props.history)
    const authToken = localStorage.getItem('AuthToken')
    axios.defaults.headers.common = { Authorization: `${authToken}` }
    axios
      .get('/user')
      .then(res => {
        console.log({ res })
        dispatch({
          type: 'DATA',
          payload: {
            firstName: res.data.user.firstName,
            lastName: res.data.user.lastName,
            email: res.data.user.email,
            username: res.data.user.username,
            profilePicture: res.data.user.imageUrl,
          },
        })
        dispatch({ type: 'LOADING', payload: false })
      })
      .catch(error => {
        if (error?.response?.status === 403) {
          props.history.push('/login')
        }
        console.log(error)
        dispatch({ type: 'LOADING', payload: false })
        dispatch({ type: 'ERROR', error: 'Error in retrieving the data' })
      })
  }, [])

  if (loading) {
    return (
      <div className={classes.root}>
        <CircularProgress size={150} className={classes.uiProgess} />
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            TodoApp
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <Divider />
        <center>
          <Avatar src={profilePicture} className={classes.avatar} />
          <p>
            {' '}
            {firstName} {lastName}
          </p>
        </center>
        <Divider />
        <List>
          <ListItem button key="Todo" onClick={loadTodoPage}>
            <ListItemIcon>
              {' '}
              <NotesIcon />{' '}
            </ListItemIcon>
            <ListItemText primary="Todo" />
          </ListItem>

          <ListItem button key="Account" onClick={loadAccountPage}>
            <ListItemIcon>
              {' '}
              <AccountBoxIcon />{' '}
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>

          <ListItem button key="Logout" onClick={logoutHandler}>
            <ListItemIcon>
              {' '}
              <ExitToAppIcon />{' '}
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <div>{render ? <Account /> : <Todo />}</div>
      {/* <div>{render ? 'account' : 'todo'}</div> */}
    </div>
  )
}

export default Home
