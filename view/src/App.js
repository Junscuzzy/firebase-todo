import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import login from './pages/login'

function App() {
  return (
    <div>
      <CssBaseline />
      <Router>
        <div>
          <Switch>
            <Route exact path="/login" component={login} />
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
