import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import cn from 'classnames';
import axios from 'axios';

import './upload.less';

@observer
export default class Upload extends Component {
  @observable images = [];
  @observable uploading = false;
  formDatas = [];
  check(files) {
    return !files.filter(file => file.type.search('image') === -1).length;
  }

  @autobind
  addFiles(e) {
    this.doAddFiles(e.target.files);
  }

  @action
  doAddFiles(files) {
    const list = Object.keys(files).map((key) => {
      const file = files[key];
      this.formDatas.push(file);
      return {
        name: file.name,
        process: 0,
        status: 0, // 1: uploading, 2: success, 0: not start, -1: error,
        errmsg: ''
      };
    });
    this.images.push(...list);
  }

  @action
  removeFile(index) {
    this.images.splice(index, 1);
    this.formDatas.splice(index, 1);
  }

  @action
  upload() {
    this.uploading = true;
    const promises = this.formDatas.map((file, index) => this.uploadOne(file, index));
    axios.all(promises).then(
      axios.spread(() => {
        runInAction(() => {
          this.uploading = false;
          console.log('all done');
        });
      })
    );
  }

  @action
  uploadOne(file, index) {
    this.images[index].status = 1;
    const data = new FormData();
    data.append('img', file);
    axios
      .post('/api/blog/img/upload', data, {
        headers: { 'content-type': 'multiple/form-data' },
        onUploadProgress: (e) => {
          const uploaded = e.loaded;
          const total = e.total;
          const process = uploaded / total;
          console.log(process);
          runInAction(() => {
            this.images[index].process = process;
          });
        }
      })
      .then(() => {
        runInAction(() => {
          this.images[index].process = 1;
          this.images[index].status = 2;
        });
      })
      .catch((err) => {
        runInAction(() => {
          this.images[index].status = -1;
          this.images[index].errmsg = err.errmsg;
          console.log(err);
        });
      });
  }

  @action
  cleanAll() {
    this.images = [];
    this.formDatas = [];
  }

  render() {
    const buttonClz = cn('ui button primary', { disabled: this.uploading });
    return (
      <div className="image-upload">
        <div className="upload-list">
          {this.images.map((image, index) => {
            const maskClz = cn('percent-mask', { error: image.status === -1 });
            let maskWidth = 0;
            if (image.status === 1) {
              maskWidth = `${(image.process * 100).toFixed(0)}%`;
            } else if (image.status === 2 || image.status === -1) {
              maskWidth = '100%';
            }
            return (
              <div key={`upload_image_${index}`} className="upload-image">
                <div className={maskClz} style={{ width: maskWidth }} />
                <div className="image-name">{image.name}</div>
                <div className="right-section">
                  {image.status > 0 ? (
                    <div className="upload-percent">{`${(image.process * 100).toFixed(0)}%`}</div>
                  ) : null}
                  {image.status === 0 ? (
                    <i className="remove icon" onClick={() => this.removeFile(index)} />
                  ) : null}
                  {image.status === 2 ? <i className="check icon" /> : null}
                </div>
              </div>
            );
          })}
        </div>
        <div className="ui divider" />
        <div className="actions">
          <button className={buttonClz} onClick={() => this.refs.forUpload.click()}>
            添加文件
          </button>
          {this.images.length ? (
            <button className={buttonClz} onClick={() => this.upload()}>
              上传
            </button>
          ) : null}
          {this.images.length ? (
            <button className={buttonClz} onClick={() => this.cleanAll()}>
              清空列表
            </button>
          ) : null}

          <input
            ref={'forUpload'}
            className="for-upload"
            type="file"
            multiple="multiple"
            onChange={this.addFiles}
          />
        </div>
      </div>
    );
  }
}
