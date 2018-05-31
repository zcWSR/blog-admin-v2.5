import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import SimpleMDE from 'simplemde';
import autobind from 'autobind-decorator';

import 'simplemde/dist/simplemde.min.css';
import './index.less';

@observer
export default class EditPost extends Component {
  componentDidMount() {
    this.mde = new SimpleMDE({
      element: this.refs.editor,
      autosave: {
        enabled: true,
        uniqueId: this.props.new ? 'newPost' : 'modifyPost',
        delay: 1000
      },
      spellChecker: false
    });
  }
  componentWillReceiveProps(props) {
    this.post = props.post;
  }

  @observable post = {
    title: '',
    category: '',
    labels: [],
    bgColor: '',
    bgUrl: '',
    section: '',
    rest: ''
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
    if (!this.post.title) {
      this.checkMessage.push('须填写"标题"');
    }
    if (!this.post.category) {
      this.checkMessage.push('须填写"类别"');
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
      const { title, category, labels, bgColor, bgUrl } = this.post;
      this.props.submit({ title, category, labels: [...labels], bgColor, bgUrl, content });
    }
  }

  @autobind
  checkLabel(event) {
    const content = event.target.value;
    if (event.keyCode === 13 && content) {
      if (this.post.labels.indexOf(content) === -1) {
        this.post.labels.push(content);
        event.target.value = '';
      }
    }
  }

  @action
  removeLabel(i) {
    this.post.labels.splice(i, 1);
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
                value={this.post.title}
                onChange={() => { this.post.title = this.refs.title.value; }}
                style={{ width: '500px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              所属类别
              <span className="important">*</span>
            </label>
            <div className="field">
              <input
                ref={'category'}
                value={this.post.category}
                onChange={() => { this.post.category = this.refs.category.value; }}
                style={{ width: '150px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>
              标签
            </label>
            <div className="field">
              <input
                ref={'label'}
                onKeyUp={this.checkLabel}
                style={{ width: '150px' }}
              />
            </div>
            <div className="ui labels blue">
              {
                this.post.labels.map((l, i) => (
                  <div className="ui label" style={{ marginBottom: 0 }} key={`label-${i}`}>
                    {l}
                    <i className="delete icon" onClick={() => this.removeLabel(i)} />
                  </div>
                ))
              }
            </div>
          </div>
          <div className="inline fields">
            <label>
              背景图主色调
            </label>
            <div className="field">
              <input
                ref={'bgColor'}
                value={this.post.bgColor}
                onChange={() => { this.post.bgColor = this.refs.bgColor.value; }}
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
                value={this.post.bgUrl}
                onChange={() => { this.post.bgUrl = this.refs.bgUrl.value; }}
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
