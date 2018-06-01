import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Frame from './frame-wrapper';
import DashBoard from './dashboard';
import PostManage from './post-manage';
import CreatePost from './create-post';
import ModifyPost from './modify-post';
import ArticleMange from './article-manage';
import CreateArticle from './create-article';
import ModifyArticle from './modify-article';
import ImageManage from './image-manage';
import UserManage from './user-manage';
import BlogManage from './blog-manage';

import Login from './login';
import NotFound from './not-found';

export default props => (
  <div>
    <Router {...props}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route
          path="/"
          render={() => (
            <Frame>
              <Route exact path="/" component={DashBoard} />
              <Route exact path="/dashboard" component={DashBoard} />
              <Route exact path="/post-manage" component={PostManage} />
              <Route exact path="/create-post" component={CreatePost} />
              <Route path="/modify-post/:id" component={ModifyPost} />
              <Route exact path="/article-manage" component={ArticleMange} />
              <Route exact path="/create-article" component={CreateArticle} />
              <Route path="/modify-article/:id" component={ModifyArticle} />
              <Route exact path="/image-manage" component={ImageManage} />
              <Route exact path="/user-manage" component={UserManage} />
              <Route exact path="/blog-manage" component={BlogManage} />
            </Frame>
          )}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </div>
);
