import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@inject('base', 'routing')
@observer
export default class UserManage extends Component {
  constructor(props) {
    super(props);
    props.base.changeActiveIndex(42);
    document.title = '用户信息管理';
  }

  render() {
    return (
      <div>
        <h3 className="ui header">用户信息管理</h3>
        <div className="ui form vertical">
          <div className="inline fields">
            <label>
              博客名
            </label>
            <div className="field">
              <input
                style={{ width: '200px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              主标语
            </label>
            <div className="field">
              <input
                style={{ width: '200px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              主标题(显示在标签上)
            </label>
            <div className="field">
              <input
                style={{ width: '200px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              顶部栏图标
            </label>
            <div className="field">
              <input
                style={{ width: '300px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              微博链接
            </label>
            <div className="field">
              <input
                style={{ width: '300px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              github链接
            </label>
            <div className="field">
              <input
                style={{ width: '300px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              邮箱链接
            </label>
            <div className="field">
              <input
                style={{ width: '300px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              分页大小
            </label>
            <div className="field">
              <input
                type="number"
                style={{ width: '50px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              页脚内容
            </label>
            <div className="field">
              <input
                style={{ width: '200px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              页脚链接
            </label>
            <div className="field">
              <input
                style={{ width: '300px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              背景图链接
            </label>
            <div className="field">
              <input
                style={{ width: '300px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              背景图主色调
            </label>
            <div className="field">
              <input
                style={{ width: '100px' }}
              />
            </div>
          </div>
          <button className="ui button primary">提交</button>
        </div>
      </div>
    );
  }
}
