import React from "react"
import {Route, BrowserRouter as Router, Switch} from "react-router-dom"

import Main from "./pages/Main"
import Analysis from "./pages/Analysis"

function App()
{
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/analysis/:index/:ticker" render={(props) => <Analysis {...props} />} />
      </Switch>
    </Router>
  )
}

export default App;
