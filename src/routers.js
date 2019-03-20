import React from 'react'
import {Route, Switch} from 'react-router-dom'
import mainPage from './components/page/mainPage'


const Routes = () => (
  <Switch>
    <Route exact path="/" component={mainPage}/>
  </Switch>

);


export default Routes
