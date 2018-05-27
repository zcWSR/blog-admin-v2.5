import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import SimpleMDE from 'simplemde';
import autobind from 'autobind-decorator';

import 'simplemde/dist/simplemde.min.css';
import './index.less';

@observer
export default class EditArticle extends Component {
  componentDidMount() {
    this.mde = new SimpleMDE({
      element: this.refs.editor,
      autosave: {
        enabled: true,
        uniqueId: this.props.new ? 'newArticle' : 'modifyArticle',
        delay: 1000
      },
      spellChecker: false
    });
  }
  componentWillReceiveProps(props) {
    this.article = props.article;
  }

  @observable article = {
    title: '',
    route: '',
    shortName: '',
    bgColor: '',
    bgUrl: ''
  }
  @observable loading = false;
  @observable checkMessage = [];
  @computed
  get showCheckMessage() {
    return !!this.checkMessage.length;
  }

  @action
  doCheck() {
    this.checkMessage = [];
    if (!this.article.title) {
      this.checkMessage.push('须填写"标题"');
    }
    if (!this.article.route) {
      this.checkMessage.push('须填写"路由"');
    }
    if (!this.article.shortName) {
      this.checkMessage.push('须填写"短名称"');
    }
    if (!this.mde.value()) {
      this.checkMessage.push('须填写"内容"');
    }
    return !this.checkMessage.length;
  }

  @autobind
  doSubmit() {
    if (this.doCheck()) {
      const content = this.mde.value();
      const { title, route, shortName, bgColor, bgUrl } = this.article;
      this.props.submit({ title, route, shortName, bgColor, bgUrl, content });
    }
  }

  render() {
    return (
      <div>
        <div className="ui form vertical" style={{ marginTop: '15px' }}>
          <div className="inline fields">
            <label>
              文章标题
              <span className="important">*</span>
            </label>
            <div className="field">
              <input
                ref={'title'}
                value={this.article.title}
                onChange={() => { this.article.title = this.refs.title.value; }}
                style={{ width: '500px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              路由
              <span className="important">*</span>
            </label>
            <div className="field">
              <input
                ref={'route'}
                value={this.article.route}
                onChange={() => { this.article.route = this.refs.route.value; }}
                style={{ width: '100px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              短标题
              <span className="important">*</span>
            </label>
            <div className="field">
              <input
                ref={'shortName'}
                value={this.article.shortName}
                onChange={() => { this.article.shortName = this.refs.shortName.value; }}
                style={{ width: '100px' }}
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
                value={this.article.bgColor}
                onChange={() => { this.article.bgColor = this.refs.bgColor.value; }}
                style={{ width: '100px' }}
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
                value={this.article.bgUrl}
                onChange={() => { this.article.bgUrl = this.refs.bgUrl.value; }}
                style={{ width: '500px' }}
              />
            </div>
          </div>
        </div>
        <div >
          <textarea ref={'editor'} />
        </div>
        {
          this.showCheckMessage && (
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
        <button className="ui primary button" onClick={this.doSubmit}>{this.props.new ? '创建' : '修改'}</button>
      </div>
    );
  }
}
