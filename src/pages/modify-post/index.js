import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import axios from 'axios';

import msgbox from 'common/components/message-box';
import Loading from 'common/components/loading';
import EditPost from 'common/components/edit-post';

@inject('base', 'routing')
@observer
export default class ModifyPost extends Component {
  constructor(props) {
    super(props);
    document.title = '修改博文';
    props.base.changeActiveIndex(0);
    this.state = { loading: false, post: null };
    this.id = this.props.match.params.id;
    if (!this.id) {
      msgbox.showMessage((
        <div>
          <p>参数错误</p>
        </div>
      ), '提示')
      .ok(() => {
        props.routing.push('/post-manage');
      });
    }
  }

  componentDidMount() {
    if (this.id) {
      this.fetchPost();
    }
  }

  doSubmit(data) {
    msgbox.showMessage((
      <div>
        <p>{`是否确认修改文章: < ${data.title} >?`}</p>
      </div>
    ), '确认')
    .ok(() => {
      this.doUpdate(data);
    });
  }

  async doUpdate(data) {
    try {
      this.setState({ loading: true });
      console.log(data);
      await axios({
        method: 'POST',
        url: '/api/blog/post/update',
        data: {
          id: this.id,
          post: data
        }
      });
      msgbox.showMessage((
        <div>
          <p>修改成功</p>
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

  async fetchPost() {
    try {
      this.setState({ loading: true });
      const meta = await axios({
        url: `/api/blog/posts/${this.id}`
      });
      const { title, category, labels, bgColor, bgUrl, section, rest, createAt } = meta.data;
      this.setState({
        post: {
          title, category, labels, bgColor, bgUrl, section, rest, createAt
        },
        loading: false
      });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div>
        <h3 className="ui header">修改博客文章</h3>
        <EditPost post={this.state.post} submit={data => this.doSubmit(data)} />
        <Loading show={this.state.loading} />
      </div>
    );
  }
}
