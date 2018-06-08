import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import cookie from 'tiny-cookie';
import axios from 'axios';
import cn from 'classnames';
import msgbox from 'common/components/message-box';

@inject('base', 'routing')
@observer
export default class UserManage extends Component {
  constructor(props) {
    super(props);
    props.base.changeActiveIndex(41);
    document.title = '用户信息管理';
  }

  @observable
  usernameChange = {
    loading: false,
    un: '',
    pw: '',
    pwc: '',
    checkMessage: ''
  };
  @observable
  passwordChange = {
    loading: false,
    opw: '',
    npw: '',
    pwc: '',
    checkMessage: ''
  };

  @action
  checkUn() {
    this.usernameChange.checkMessage = '';
    const { un, pw, pwc } = this.usernameChange;
    if (!un || !pw || !pwc) {
      this.usernameChange.checkMessage = '填写项不可为空';
    }
    if (pw !== pwc) {
      this.usernameChange.checkMessage = '二次确认密码与密码不符';
    }
    return !this.usernameChange.checkMessage;
  }

  @action
  checkPw() {
    this.passwordChange.checkMessage = '';
    const { opw, npw, pwc } = this.passwordChange;
    if (!opw || !npw || !pwc) {
      this.passwordChange.checkMessage = '填写项不可为空';
    }
    if (npw !== pwc) {
      this.passwordChange.checkMessage = '二次确认密码与新密码不符';
    }
    return !this.passwordChange.checkMessage;
  }

  @action
  async doChangUn() {
    runInAction(() => {
      this.usernameChange.loading = true;
    });
    const { un, pw } = this.usernameChange;
    try {
      await axios({
        method: 'POST',
        url: '/api/blog/admin/username/update',
        data: {
          oldUsername: cookie.get('username'),
          newUsername: un,
          password: pw
        }
      });
      msgbox.showMessage('修改成功, 请重新登录', '提示').ok(() => {
        this.props.routing.push('/login');
      });
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.usernameChange.loading = false;
      });
    }
  }

  @autobind
  changeUn() {
    if (this.checkUn()) {
      msgbox.showMessage(`确认修改用户名为: "${this.usernameChange.un}"吗?`, '提示').ok(() => {
        this.doChangUn();
      });
    }
  }

  @action
  async doChangePw() {
    runInAction(() => {
      this.passwordChange.loading = true;
    });
    const { opw, npw } = this.passwordChange;
    try {
      await axios({
        method: 'POST',
        url: '/api/blog/admin/password/update',
        data: {
          username: cookie.get('username'),
          oldPassword: opw,
          newPassword: npw
        }
      });
      msgbox.showMessage('修改成功, 请重新登录', '提示').ok(() => {
        this.props.routing.push('/login');
      });
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.passwordChange.loading = false;
      });
    }
  }

  @autobind
  changePw() {
    if (this.checkPw()) {
      msgbox.showMessage('确认修改密码吗?', '提示').ok(() => {
        this.doChangePw();
      });
    }
  }

  render() {
    const changeUnBtnClz = cn('ui button primary', {
      loading: this.usernameChange.loading,
      disabled: this.usernameChange.loading || this.passwordChange.loading
    });
    const changePwBtnClz = cn('ui button primary', {
      loading: this.passwordChange.loading,
      disabled: this.passwordChange.loading || this.usernameChange.loading
    });
    return (
      <div>
        <h3 className="ui header">用户信息管理</h3>
        <h4 className="ui header">更改用户名</h4>
        <div className="ui form vertical">
          <div className="inline fields">
            <label>用户名</label>
            <div className="field">
              <input
                value={this.usernameChange.un}
                onChange={(e) => {
                  this.usernameChange.un = e.target.value;
                }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>密码</label>
            <div className="field">
              <input
                type="password"
                value={this.usernameChange.pw}
                onChange={(e) => {
                  this.usernameChange.pw = e.target.value;
                }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>二次确认</label>
            <div className="field">
              <input
                type="password"
                value={this.usernameChange.pwc}
                onChange={(e) => {
                  this.usernameChange.pwc = e.target.value;
                }}
              />
            </div>
          </div>
          {!!this.usernameChange.checkMessage && (
            <div className="ui error message" style={{ display: 'block', width: 270 }}>
              <p>{this.usernameChange.checkMessage}</p>
            </div>
          )}
          <button className={changeUnBtnClz} onClick={this.changeUn}>
            提交
          </button>
        </div>
        <div className="ui divider" />
        <h4 className="ui header">更改密码</h4>
        <div className="ui form vertical">
          <div className="inline fields">
            <label>老密码</label>
            <div className="field">
              <input
                type="password"
                value={this.passwordChange.opw}
                onChange={(e) => {
                  this.passwordChange.opw = e.target.value;
                }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>新密码</label>
            <div className="field">
              <input
                type="password"
                value={this.passwordChange.npw}
                onChange={(e) => {
                  this.passwordChange.npw = e.target.value;
                }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>二次确认</label>
            <div className="field">
              <input
                type="password"
                value={this.passwordChange.pwc}
                onChange={(e) => {
                  this.passwordChange.pwc = e.target.value;
                }}
              />
            </div>
          </div>
          {!!this.passwordChange.checkMessage && (
            <div className="ui error message" style={{ display: 'block', width: 270 }}>
              <p>{this.passwordChange.checkMessage}</p>
            </div>
          )}
          <button className={changePwBtnClz} onClick={this.changePw}>
            提交
          </button>
        </div>
      </div>
    );
  }
}
