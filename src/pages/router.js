import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
// import { Router, Route, Switch } from 'react-router-dom';
import cookie from 'tiny-cookie';

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


function isAuthenticate() {
  return cookie.get('token') || cookie.get('username');
}

export default props => (
  <div>
    <Router {...props}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route
          path="/"
          render={() => (
            <Frame>
              <Route exact path="/" render={p => isAuthenticate() ? <DashBoard {...p} /> : <Redirect to="/login" />} />
              <Route exact path="/dashboard" render={p => isAuthenticate() ? <DashBoard {...p} /> : <Redirect to="/login" />} />
              <Route exact path="/post-manage" render={p => isAuthenticate() ? <PostManage {...p} /> : <Redirect to="/login" />} />
              <Route exact path="/create-post" render={p => isAuthenticate() ? <CreatePost {...p} /> : <Redirect to="/login" />} />
              <Route path="/modify-post/:id" render={p => isAuthenticate() ? <ModifyPost {...p} /> : <Redirect to="/login" />} />
              <Route exact path="/article-manage" render={p => isAuthenticate() ? <ArticleMange {...p} /> : <Redirect to="/login" />} />
              <Route exact path="/create-article" render={p => isAuthenticate() ? <CreateArticle {...p} /> : <Redirect to="/login" />} />
              <Route path="/modify-article/:id" render={p => isAuthenticate() ? <ModifyArticle {...p} /> : <Redirect to="/login" />} />
              <Route exact path="/image-manage" render={p => isAuthenticate() ? <ImageManage {...p} /> : <Redirect to="/login" />} />
              <Route exact path="/user-manage" render={p => isAuthenticate() ? <UserManage {...p} /> : <Redirect to="/login" />} />
              <Route exact path="/blog-manage" render={p => isAuthenticate() ? <BlogManage {...p} /> : <Redirect to="/login" />} />
            </Frame>
            )}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </div>
);
// export default props => (
//   <div>
//     <Router {...props}>
//       <Switch>
//         <Route exact path="/login" component={Login} />
//         <Route
//           path="/"
//           render={() => (
//             <Frame>
//               <Route exact path="/" component={DashBoard} />
//               <Route exact path="/dashboard" component={DashBoard} />
//               <Route exact path="/post-manage" component={PostManage} />
//               <Route exact path="/create-post" component={CreatePost} />
//               <Route path="/modify-post/:id" component={ModifyPost} />
//               <Route exact path="/article-manage" component={ArticleMange} />
//               <Route exact path="/create-article" component={CreateArticle} />
//               <Route path="/modify-article/:id" component={ModifyArticle} />
//               <Route exact path="/image-manage" component={ImageManage} />
//               <Route exact path="/user-manage" component={UserManage} />
//               <Route exact path="/blog-manage" component={BlogManage} />
//             </Frame>
//             )}
//         />
//         <Route component={NotFound} />
//       </Switch>
//     </Router>
//   </div>
// );
