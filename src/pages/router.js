import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Frame from './frame-wrapper';
import DashBoard from './dashboard';
import Login from './login';
import NotFound from './not-found';

export default props => (
  <Router {...props} >
    <Frame>
      <Switch>
        <Route exact path="/" component={DashBoard} />
        <Route path="/dashboard" component={DashBoard} />
        <Route path='/login' component={Login} />
        <Route component={NotFound} />
      </Switch>
    </Frame>
  </Router>
);
