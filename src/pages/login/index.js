import React, { Component } from 'react';
import { inject } from 'mobx-react';
import axios from 'axios';
import cn from 'classnames';
import cookie from 'tiny-cookie';
import autobind from 'autobind-decorator';

import './index.less';

@inject('base', 'routing')
// @observer
export default class Login extends Component {
  constructor(props) {
    super();
    document.title = '登录';
    props.base.changeActiveIndex(0);
    this.state = {
      errmsg: '',
      username: '',
      password: '',
      loading: false
    };
  }

  loginCheck() {
    const { username, password } = this.state;
    let errmsg = '';
    if (!username) {
      errmsg = '用户名不可为空';
    }
    if (!password) {
      errmsg = '密码不可为空';
    }
    this.setState({ errmsg });
    return !errmsg;
  }

  @autobind
  async login() {
    if (!this.loginCheck()) { return; }
    this.setState({ loading: true });
    try {
      const { username, password } = this.state;
      const meta = await axios({
        method: 'POST',
        url: '/api/blog/admin/login',
        data: { username, password }
      });
      const errmsg = meta.data;
      if (errmsg) {
        this.setState({ errmsg });
      } else {
        this.props.base.changeUsername(cookie.get('username'));
        this.props.routing.push('/');
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { username, password, errmsg, loading } = this.state;
    const loginBtnClz = cn('fluid ui large button blue', { loading, disabled: loading });
    return (
      <div className="login-container">
        <div className="ui login form error">
          <div className="field">
            <div className="ui large icon input">
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => {
                  this.setState({ username: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="field">
            <div className="ui large icon input">
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => {
                  this.setState({ password: e.target.value });
                }}
              />
            </div>
          </div>
          {
            !!errmsg && (
              <div className="ui error message">
                <p>{errmsg}</p>
              </div>
            )
          }
          <div className="field">
            <button className={loginBtnClz} onClick={this.login}>登录</button>
          </div>
        </div>
      </div>
    );
  }
}
