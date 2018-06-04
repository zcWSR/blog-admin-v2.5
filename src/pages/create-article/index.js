import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import axios from 'axios';

import msgbox from 'common/components/message-box';
import Loading from 'common/components/loading';
import EditArticle from 'common/components/edit-article';

@inject('base', 'routing')
@observer
export default class CreateArticle extends Component {
  constructor(props) {
    super(props);
    document.title = '创建小文章';
    props.base.changeActiveIndex(32);
    this.state = { loading: false };
  }

  doSubmit(data) {
    msgbox.showMessage((
      <div>
        <p>{`是否确认创建文章: <${data.title}>?`}</p>
      </div>
    ), '确认')
    .ok(() => {
      this.doUpload(data);
    });
  }

  async doUpload(data) {
    try {
      this.setState({ loading: true });
      await axios({
        method: 'POST',
        url: '/api/blog/article/upload',
        data: {
          article: data
        }
      });
      this.refs.EditArticle.clearAutoSave();
      msgbox.showMessage((
        <div>
          <p>创建成功</p>
        </div>
      ), '提示')
      .ok(() => {
        this.props.routing.push('/article-manage');
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div>
        <h3 className="ui header">新建小文章</h3>
        <EditArticle new submit={data => this.doSubmit(data)} ref={'EditArticle'} />
        <Loading show={this.state.loading} />
      </div>
    );
  }
}
