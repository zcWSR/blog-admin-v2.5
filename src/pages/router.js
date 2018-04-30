import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Frame from './frame-wrapper';
import DashBoard from './dashboard';
import PostManage from './post-manage';
import CreatePost from './create-post';

import Login from './login';
import NotFound from './not-found';

export default props => (
  <div>
    <Router {...props} >
      <Frame>
        <Switch>
          <Route exact path="/" component={DashBoard} />
          <Route path="/dashboard" component={DashBoard} />
          <Route path="/post-manage" component={PostManage} />
          <Route path="/create-post" component={CreatePost} />
          <Route path='/login' component={Login} />
          <Route component={NotFound} />
        </Switch>
      </Frame>
    </Router>
  </div>
);
