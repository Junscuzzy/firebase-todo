import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Login from './pages/login'
import Signup from './pages/signup'
import Home from './pages/home'

function App() {
  return (
    <div>
      <CssBaseline />
      <Router>
        <div>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
