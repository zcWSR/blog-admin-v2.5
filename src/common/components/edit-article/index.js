import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import SimpleMDE from 'simplemde';
import autobind from 'autobind-decorator';

import msgbox from 'common/components/message-box';

import './index.less';

@observer
export default class EditArticle extends Component {
  componentDidMount() {
    this.mde = new SimpleMDE({
      element: this.refs.editor,
      // autosave: {
      //   enabled: false,
      //   uniqueId: this.props.new ? 'newArticle' : 'modifyArticle',
      //   delay: 1000
      // },
      placeholder: '在此输入内容',
      toolbarTips: true,
      spellChecker: false
    });
    if (this.props.new) {
      this.loadFromAutoSave();
      this.startAutoSave();
    }
  }

  componentWillReceiveProps(props) {
    if (props.article) {
      this.loadArticle(props.article);
    }
  }

  @observable
  article = {
    title: '',
    route: '',
    shortName: '',
    bgColor: '',
    bgUrl: ''
  };
  @observable loading = false;
  @observable checkMessage = [];
  @computed
  get showCheckMessage() {
    return !!this.checkMessage.length;
  }

  startAutoSave() {
    const delay = 1000 * 60 * 3;
    setInterval(() => {
      const forSave = JSON.stringify(
        Object.assign({}, this.article, { content: this.mde.value() })
      );
      window.localStorage.setItem('newArticle', forSave);
    }, delay);
  }

  loadFromAutoSave() {
    let autoSave = window.localStorage.getItem('newArticle');
    if (!autoSave) return;
    autoSave = JSON.parse(autoSave);
    this.article.title = autoSave.title;
    this.article.route = autoSave.route;
    this.article.shortName = autoSave.shortName;
    this.article.bgColor = autoSave.bgColor;
    this.article.bgUrl = autoSave.bgUrl;
    this.mde.value(autoSave.content);
  }

  clearAutoSave() {
    window.localStorage.removeItem('newArticle');
  }

  @action
  loadArticle(article) {
    if (!this.loaded) {
      this.article = article;
      this.mde.value(article.content);
      this.loaded = true;
    }
  }

  @action
  doCheck() {
    this.checkMessage = [];
    if (!this.article.title) {
      this.checkMessage.push('"标题" 不可为空');
    }
    if (!this.article.route) {
      this.checkMessage.push('"路由" 不可为空');
    }
    if (this.article.bgColor && !/^#[a-fA-F0-9]{3,6}$/.test(this.article.bgColor)) {
      this.checkMessage.push('"背景图主色调" 格式错误, 请使用16进制颜色表示');
    }
    if (
      this.article.bgUrl &&
      !/^(https?):(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(
        this.article.bgUrl
      )
    ) {
      this.checkMessage.push('"背景图链接" 格式错误, 注意携带http或https协议头');
    }
    if (!this.article.shortName) {
      this.checkMessage.push('"短名称" 不可为空');
    }
    if (!this.mde.value()) {
      this.checkMessage.push('"内容" 不可为空');
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
                value={this.article.title}
                onChange={() => {
                  this.article.title = this.refs.title.value;
                }}
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
                onChange={() => {
                  this.article.route = this.refs.route.value;
                }}
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
                onChange={() => {
                  this.article.shortName = this.refs.shortName.value;
                }}
                style={{ width: '100px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>背景图主色调</label>
            <div className="field">
              <input
                ref={'bgColor'}
                value={this.article.bgColor}
                onChange={() => {
                  this.article.bgColor = this.refs.bgColor.value;
                }}
                style={{ width: '100px' }}
              />
            </div>
          </div>
          <div className="inline fields">
            <label>背景图链接</label>
            <div className="field">
              <input
                ref={'bgUrl'}
                value={this.article.bgUrl}
                onChange={() => {
                  this.article.bgUrl = this.refs.bgUrl.value;
                }}
                style={{ width: '500px' }}
              />
            </div>
          </div>
        </div>
        <div className="inline fields">
          <button className="ui button primary" onClick={this.uploadFile}>
            从文件上传文档
          </button>
          <button
            className="ui button red"
            onClick={() => {
              this.mde.value('');
            }}
          >
            清空
          </button>
          <input
            ref={'uploadFile'}
            className="for-upload"
            type="file"
            onChange={this.doUploadFile}
          />
        </div>
        <div className="editor-container">
          <textarea ref={'editor'} />
        </div>
        {this.showCheckMessage && (
          <div className="ui error message" style={{ display: 'block' }}>
            <div className="header">填写出错</div>
            <ul className="list">
              {this.checkMessage.map((err, i) => <li key={`err_${i}`}>{err}</li>)}
            </ul>
          </div>
        )}
        <div className="ui divider" />
        <button className="ui primary button" onClick={this.doSubmit}>
          {this.props.new ? '创建' : '修改'}
        </button>
      </div>
    );
  }
}
