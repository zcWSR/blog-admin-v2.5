import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import autobind from 'autobind-decorator';
import axios from 'axios';
import clipboardCopy from 'clipboard-copy';
import cn from 'classnames';

import msgbox from 'common/components/message-box';
import uploadMsgbox from 'common/components/message-box';
import Pager from 'common/components/pager';
import Loading from 'common/components/loading';

import Upload from './upload';

import './index.less';

@inject('base', 'routing')
@observer
export default class ImageManage extends Component {
  constructor(props) {
    super(props);
    props.base.changeActiveIndex(21);
    document.title = '图片管理';
    this.state = {
      selectMode: false,
      curPage: 1,
      totalCount: 0,
      pageSize: 15,
      images: [],
      loading: false
    };
  }

  componentDidMount() {
    this.getImageList();
  }

  @autobind
  async getImageList(newPage) {
    this.setState({ loading: true });
    let page = 1;
    if (newPage) {
      page = newPage;
    } else {
      page = this.state.curPage;
    }
    try {
      this.setState({ loading: true });
      const meta = await axios({
        url: '/api/blog/imgs',
        params: { page, pageSize: this.state.pageSize }
      });
      const { pageSize, curPage, totalCount, list } = meta.data;
      this.setState({ images: list, pageSize, curPage, totalCount });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  getImageSize(size) {
    const convert = size / 1024;
    if (convert < 1024) {
      return `${convert.toFixed(2)}kb`;
    }
    return `${(convert / 1024).toFixed(2)}mb`;
  }

  @autobind
  upload() {
    uploadMsgbox.showMessage(
      <Upload />,
    '上传图片')
      .ok(() => {
        this.getImageList(1);
      });
  }

  @autobind
  toggleSelectMode() {
    if (this.state.selectMode) {
      const list = this.state.images.map((item) => {
        item.select = false;
        return item;
      });
      this.setState({
        selectMode: !this.state.selectMode,
        images: JSON.parse(JSON.stringify(list))
      });
    } else {
      this.setState({
        selectMode: !this.state.selectMode
      });
    }
  }

  @autobind
  copyImageUrl(url) {
    clipboardCopy(url);
    alert('复制成功');
  }

  @autobind
  copyMainColor(mainColor) {
    clipboardCopy(mainColor);
    alert('复制成功');
  }

  showInfo(image) {
    msgbox.showMessage(
      <div className="image-info-modal">
        <a className="image" target="_blank" href={image.url}>
          <img src={`${image.url}-normal`} alt={image.name} />
        </a>
        <div className="ui divider" />
        <div className="image-info-container">
          <p className="image-info">
            <span className="info-name">图片名称:</span>
            {image.name}
          </p>
          <p className="image-info">
            <span className="info-name">原图分辨率:</span>
            {`${image.height} x ${image.width}`}
          </p>
          <p className="image-info">
            <span className="info-name">原图大小:</span>
            {`约${this.getImageSize(image.size)} (${image.size}字节)`}
          </p>
          <p className="image-info">
            <span className="info-name">主色调:</span>
            {image.mainColor}
            <div
              className="main-color-box"
              style={{ background: image.mainColor }}
              onClick={() => this.copyImageUrl(image.mainColor)}
            />
          </p>
          <p className="image-info">
            <span className="info-name">图片外链(压缩后):</span>
            <span className="tip">点击复制</span>
            <a className="image-link" onClick={() => this.copyImageUrl(`${image.url}-normal`)}>
              {`${image.url}-normal`}
            </a>
          </p>
        </div>
      </div>,
      '图片详情'
    );
  }

  delete(image) {
    msgbox
      .showMessage(
        <div>
          <p>{`图片: ${image.name}`}</p>
          <p>确认删除?</p>
        </div>,
        '提示'
      )
      .ok(() => {
        this.doDelete(image.id);
      });
  }

  async doDelete(id) {
    this.setState({ loading: true });
    try {
      await axios({
        method: 'POST',
        url: '/api/blog/img/delete',
        data: { id }
      });
      this.getImageList(1);
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  }

  @autobind
  deleteSome() {
    const ids = this.state.images.reduce((prev, current) => {
      if (current.select) {
        prev.push(current.id);
      }
      return prev;
    }, []);

    if (!ids.length) return;
    msgbox
      .showMessage(
        <div>
          <p>{`确认删除选中的${ids.length}张图片吗?`}</p>
        </div>,
        '提示'
      )
      .ok(() => {
        this.doDeleteSome(ids);
      });
  }

  async doDeleteSome(ids) {
    this.setState({ loading: true });
    try {
      await axios({
        method: 'POST',
        url: '/api/blog/img/delete/some',
        data: { ids: ids.join(',') }
      });
      this.getImageList(1);
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  }

  select(index) {
    const list = this.state.images;
    list[index].select = !list[index].select;
    this.setState({
      images: JSON.parse(JSON.stringify(list))
    });
  }

  render() {
    const { selectMode, images, curPage, totalCount, pageSize, loading } = this.state;
    return (
      <div>
        <h3 className="ui header">图片管理</h3>
        <div className="ui form vertical segment search">
          <div className="inline fields">
            {/* <button className="ui button primary">添加图片</button> */}
            <button className="ui button primary" onClick={this.upload}>上传图片</button>
          </div>
          <div className="inline fields">
            <button className="ui button primary" onClick={this.toggleSelectMode}>
              {selectMode ? '退出批量删除' : '批量删除'}
            </button>
            {selectMode ? <button className="ui button red" onClick={this.deleteSome}>删除</button> : null}
          </div>
        </div>
        <div className="image-container">
          {images.map((item, index) => {
            const maskClz = cn('mask', { stay: item.select });
            const imageWidth = (150 * (item.width / item.height)) - 1;
            return (
              <div key={`image_${index}`} className="image" style={{ width: imageWidth }}>
                {selectMode ? (
                  <div className={maskClz} onClick={() => this.select(index)}>
                    {item.select ? (
                      <i className="mask-content check circle icon" />
                    ) : (
                      <span className="mask-content">点击选中</span>
                    )}
                  </div>
                ) : (
                  <div className="mask">
                    <span className="mask-content" onClick={() => this.showInfo(item)}>
                      查看详情
                    </span>
                    <span className="mask-content" onClick={() => this.delete(item)}>
                      删除
                    </span>
                  </div>
                )}
                <img src={`${item.url}-small`} alt={item.name} />
              </div>
            );
          })}
        </div>
        <Pager
          curPage={curPage}
          totalCount={totalCount}
          pageSize={pageSize}
          clickHandler={this.getImageList}
        />
        <Loading show={loading} />
      </div>
    );
  }
}
