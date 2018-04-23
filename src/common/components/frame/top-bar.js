import React, { Component } from 'react';
import classnames from 'classnames';
import axios from 'axios';
// import jsonp from 'jsonp';
import cookie from 'tiny-cookie';

const logout = () => {
  axios('/api/admin/logout')
  .then(() => {
    console.log('已登出');
    // cookie.set('qsso_user_name', '', { expires: (new Date(32524724988935)).toGMTString() });
    cookie.remove('token');
    cookie.remove('userName');
    window.location.href = '/login';
  });
};

export default class TopBar extends Component {

  constructor() {
    super();
    this.state = {
      username: ''
    };
  }

  componentWillMount() {
    const username = cookie.get('qsso_user_name');
    if (username) {
      this.setState({ username });
    } else {
      axios('/x3/api/user/getLoginUser')
      .then(meta => meta.data)
      .then(
      (newUsername) => {
        this.setState({ username: newUsername });
        cookie.set('qsso_user_name', newUsername, { expires: (new Date(32524724988935)).toGMTString() });
      });
    }
  }

  // componentDidMount() {
  //   this.setState({ username: cookie.get('qsso_user_name') });
  // }

  render() {
    const pageContentClz = classnames('ui fixed icon menu top-bar', { toggle: this.props.toggle });
    return (
      <div className={pageContentClz}>
        <div className="left menu">
          <a className="item" onClick={this.props.onToggleBtnClick}><i className="content icon large" /></a>
        </div>
        <div className="right menu">
          <a className="item username" href="https://qunar.it/usercenter/"><i className="user icon large" />&nbsp;&nbsp;{this.state.username}</a>
          <a className="item" onClick={logout}><i className="sign out icon large " /></a>
        </div>
      </div>
    );
  }
}

TopBar.propTypes = {
  onToggleBtnClick: React.PropTypes.func.isRequired,
  toggle: React.PropTypes.bool.isRequired
};
