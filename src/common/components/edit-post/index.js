import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import SimpleMDE from 'simplemde';
import autobind from 'autobind-decorator';

import msgbox from 'common/components/message-box';

import 'simplemde/dist/simplemde.min.css';

import './index.less';

@observer
export default class EditPost extends Component {
  componentDidMount() {
    this.mde = new SimpleMDE({
      element: this.refs.editor,
      autosave: {
        enabled: this.props.new,
        uniqueId: this.props.new ? 'newPost' : 'modifyPost',
        delay: 1000
      },
      spellChecker: false
    });
  }
  componentWillReceiveProps(props) {
    if (props.post) {
      this.loadPost(props.post);
    }
  }

  @observable post = {
    title: '',
    category: '',
    labels: [],
    bgColor: '',
    bgUrl: '',
    createAt: new Date().getTime()
  }
  @observable checkMessage = [];
  @computed
  get showCheckMessage() {
    return !!this.checkMessage.length;
  }

  @action
  loadPost(post) {
    if (!this.loaded) {
      console.log('load from father comp');
      this.post = post;
      this.mde.value(`${post.section}\n<!-- more -->\n${post.rest}`);
      this.loaded = true;
    }
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
      const { title, category, labels, bgColor, bgUrl, createAt } = this.post;
      this.props.submit({
        title, category, labels: [...labels], bgColor, bgUrl, content, createAt
      });
    }
  }

  @autobind
  checkLabel(e) {
    const content = e.target.value;
    if (e.keyCode === 13 && content) {
      if (this.post.labels.indexOf(content) === -1) {
        this.post.labels.push(content.trim());
        e.target.value = '';
      }
    }
  }

  @action
  removeLabel(i) {
    this.post.labels.splice(i, 1);
  }

  @autobind
  uploadFile() {
    this.refs.uploadFile.click();
  }

  @autobind
  doUploadFile(e) {
    const file = e.target.files[0];
    if (file.type !== 'text/markdown') {
      msgbox.showMessage('格式不正确', '提示');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.mde.value(reader.result);
    };
    reader.onerror = (err) => {
      msgbox.showMessage(err.toString() || '读取文件出错', '错误');
    };
    reader.readAsText(file);
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
                value={this.post.category || ''}
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
                onKeyDown={this.checkLabel}
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
                value={this.post.bgColor || ''}
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
                value={this.post.bgUrl || ''}
                onChange={() => { this.post.bgUrl = this.refs.bgUrl.value; }}
                style={{ width: '500px' }}
              />
            </div>
          </div>
        </div>
        <div className="inline fields">
          <button className="ui button primary" onClick={this.uploadFile}>从文件上传文档</button>
          <button className="ui button red" onClick={() => { this.mde.value(''); }}>清空</button>
          <input ref={'uploadFile'} className="for-upload" type="file" onChange={this.doUploadFile} />
        </div>
        <div className="editor-container">
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
