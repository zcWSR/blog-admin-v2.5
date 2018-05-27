import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@inject('base', 'routing')
@observer
export default class UserManage extends Component {
  constructor(props) {
    super(props);
    props.base.changeActiveIndex(41);
    document.title = '用户信息管理';
  }

  render() {
    return (
      <div>
        <h3 className="ui header">用户信息管理</h3>
        <h4 className="ui header">更改用户名</h4>
        <div className="ui form vertical">
          <div className="inline fields">
            <label>
              用户名
            </label>
            <div className="field">
              <input />
            </div>
          </div>
          <div className="inline fields">
            <label>
              密码
            </label>
            <div className="field">
              <input type="password" />
            </div>
          </div>
          <div className="inline fields">
            <label>
              二次确认密码
            </label>
            <div className="field">
              <input type="password" />
            </div>
          </div>
          <button className="ui button primary">提交</button>
        </div>
        <div className="ui divider" />
        <h4 className="ui header">更改密码</h4>
        <div className="ui form vertical">
          <div className="inline fields">
            <label>
              密码
            </label>
            <div className="field">
              <input type="password" />
            </div>
          </div>
          <div className="inline fields">
            <label>
              二次确认密码
            </label>
            <div className="field">
              <input type="password" />
            </div>
          </div>
          <button className="ui button primary">提交</button>
        </div>
      </div>
    );
  }
}
