import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Frame from './frame-wrapper';
import DashBoard from './dashboard';
import PostManage from './post-manage';
import CreatePost from './create-post';
import ArticleMange from './article-manage';
import CreateArticle from './create-article';
import ImageManage from './image-manage';
import UserManage from './user-manage';
import BlogManage from './blog-manage';

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
          <Route path="/article-manage" component={ArticleMange} />
          <Route path="/create-article" component={CreateArticle} />
          <Route path="/image-manage" component={ImageManage} />
          <Route path="/user-manage" component={UserManage} />
          <Route path="/blog-manage" component={BlogManage} />
          <Route path='/login' component={Login} />
          <Route component={NotFound} />
        </Switch>
      </Frame>
    </Router>
  </div>
);
