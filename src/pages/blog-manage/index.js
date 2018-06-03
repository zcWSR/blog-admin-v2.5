import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import autobind from 'autobind-decorator';

import msgbox from 'common/components/message-box';
import Loading from 'common/components/loading';

import './index.less';

@inject('base', 'routing')
@observer
export default class UserManage extends Component {

  constructor(props) {
    super(props);
    props.base.changeActiveIndex(42);
    document.title = '用户信息管理';
  }

  componentDidMount() {
    this.fetchConfig();
  }

  @observable loading = false;
  @observable checkMessage = [];
  @observable
  config = {
    pageTitle: '',
    blogName: '',
    slogen: '',
    topIconUrl: '',
    weiboLink: '',
    githubLink: '',
    mailLink: '',
    pageSize: '',
    footer: '',
    footerLink: '',
    bgUrl: '',
    bgColor: ''
  }

  @action
  async fetchConfig() {
    runInAction(() => { this.loading = true; });
    const meta = await axios({
      url: '/api/blog/admin/config'
    });
    runInAction(() => {
      this.config = Object.assign({}, this.config, meta.data);
      this.loading = false;
    });
  }

  @action
  doCheck() {
    this.checkMessage = [];
    const mapList = Object.keys(this.config)
      .reduce((prev, next) => {
        const value = this.config[next];
        prev.push(value);
        return prev;
      }, []);
    if (mapList.indexOf('') !== -1) {
      this.checkMessage.push('所有字段不可为空');
    }

    const urlTypeCheckMap = {
      topIconUrl: '顶部栏图标',
      weiboLink: '微博链接',
      githubLink: 'github链接',
      footerLink: '页脚链接',
      bgUrl: '背景图链接'
    };
    Object.keys(urlTypeCheckMap).forEach((key) => {
      const content = this.config[key];
      if (
        !/^(https?):(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(content)
      ) {
        this.checkMessage.push(`"${urlTypeCheckMap[key]}" 格式错误, 注意携带http或https协议头`);
      }
    });

    if (
      !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.config.mailLink)
    ) {
      this.checkMessage.push('"邮箱链接" 格式错误');
    }

    if (!/^#[a-fA-F0-9]{3,6}$/.test(this.config.bgColor)) {
      this.checkMessage.push('"背景图主色调" 格式错误, 请使用16进制颜色表示');
    }

    return !this.checkMessage.length;
  }

  @autobind
  submit() {
    if (this.doCheck()) {
      msgbox.showMessage('确认修改吗', '提示')
      .ok(() => this.doSubmit());
    }
  }


  @action
  async doSubmit() {
    runInAction(() => { this.loading = true; });
    try {
      await axios({
        method: 'POST',
        url: 'api/blog/admin/config/update',
        data: {
          config: this.config
        }
      });
      msgbox.showMessage('修改成功', '提示')
      .ok(() => this.fetchConfig());
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => { this.loading = false; });
    }
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
                ref={'blogName'}
                style={{ width: '200px' }}
                value={this.config.blogName}
                onChange={() => { this.config.blogName = this.refs.blogName.value; }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              主标语
            </label>
            <div className="field">
              <input
                ref={'slogen'}
                style={{ width: '200px' }}
                value={this.config.slogen}
                onChange={() => { this.config.slogen = this.refs.slogen.value; }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              网页标题
            </label>
            <div className="field">
              <input
                ref={'pageTitle'}
                style={{ width: '200px' }}
                value={this.config.pageTitle}
                onChange={() => { this.config.pageTitle = this.refs.pageTitle.value; }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              顶部栏图标
            </label>
            <div className="field">
              <input
                ref={'topIconUrl'}
                style={{ width: '300px' }}
                value={this.config.topIconUrl}
                onChange={() => { this.config.topIconUrl = this.refs.topIconUrl.value; }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              微博链接
            </label>
            <div className="field">
              <input
                ref={'weiboLink'}
                style={{ width: '300px' }}
                value={this.config.weiboLink}
                onChange={() => { this.config.weiboLink = this.refs.weiboLink.value; }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              github链接
            </label>
            <div className="field">
              <input
                ref={'githubLink'}
                style={{ width: '300px' }}
                value={this.config.githubLink}
                onChange={() => { this.config.githubLink = this.refs.githubLink.value; }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              邮箱链接
            </label>
            <div className="field">
              <input
                ref={'mailLink'}
                style={{ width: '300px' }}
                value={this.config.mailLink}
                onChange={() => { this.config.mailLink = this.refs.mailLink.value; }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              分页大小
            </label>
            <div className="field">
              <input
                ref={'pageSize'}
                type="number"
                style={{ width: '60px' }}
                value={this.config.pageSize}
                onChange={() => {
                  if (this.refs.pageSize.value <= 5) {
                    this.config.pageSize = 5;
                  } else if (this.refs.pageSize.value >= 15) {
                    this.config.pageSize = 15;
                  } else {
                    this.config.pageSize = this.refs.pageSize.value;
                  }
                }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              页脚内容
            </label>
            <div className="field">
              <input
                ref={'footer'}
                style={{ width: '200px' }}
                value={this.config.footer}
                onChange={() => { this.config.footer = this.refs.footer.value; }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              页脚链接
            </label>
            <div className="field">
              <input
                ref={'footerLink'}
                style={{ width: '300px' }}
                value={this.config.footerLink}
                onChange={() => { this.config.footerLink = this.refs.footerLink.value; }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              背景图链接
            </label>
            <div className="field">
              <input
                ref={'bgUrl'}
                style={{ width: '300px' }}
                value={this.config.bgUrl}
                onChange={() => { this.config.bgUrl = this.refs.bgUrl.value; }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              背景图主色调
            </label>
            <div className="field">
              <input
                ref={'bgColor'}
                style={{ width: '100px' }}
                value={this.config.bgColor}
                onChange={() => { this.config.bgColor = this.refs.bgColor.value; }}
              />
            </div>
            <div className='main-color-box' style={{ background: this.config.bgColor }} />
          </div>
          {
            !!this.checkMessage.length && (
              <div className="ui error message" style={{ display: 'block' }}>
                <div className="header">
                  填写出错
                </div>
                <ul className="list">
                  {this.checkMessage.map((err, i) => (<li key={`err_${i}`}>{err}</li>))}
                </ul>
              </div>
            )
          }
          <div className="ui divider" />
          <button className="ui button primary" onClick={this.submit}>提交</button>
        </div>
        <Loading show={this.loading} />
      </div>
    );
  }
}
