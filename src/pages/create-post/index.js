import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import axios from 'axios';

import msgbox from 'common/components/message-box';
import Loading from 'common/components/loading';


import EditPost from '../edit-post';

@inject('base', 'routing')
@observer
export default class CreatePost extends Component {
  constructor(props) {
    super(props);
    props.base.changeActiveIndex(12);
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
        url: '/api/blog/posts/upload',
        data: {
          post: data
        }
      });
      msgbox.showMessage((
        <div>
          <p>创建成功</p>
        </div>
      ), '提示')
      .ok(() => {
        this.props.routing.push('/post-manage');
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
        <h3 className="ui header">新建博客文章</h3>
        <EditPost new submit={data => this.doSubmit(data)} />
        <Loading show={this.state.loading} />
      </div>
    );
  }
}
