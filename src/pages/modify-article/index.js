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
    document.title = '修改小文章';
    props.base.changeActiveIndex(0);
    this.state = { loading: false, article: null };
    this.id = this.props.match.params.id;
    if (!this.id) {
      msgbox.showMessage((
        <div>
          <p>参数错误</p>
        </div>
      ), '提示')
      .ok(() => {
        props.routing.push('/article-manage');
      });
    }
  }

  componentDidMount() {
    if (this.id) {
      this.fetchArticle();
    }
  }

  doSubmit(data) {
    msgbox.showMessage((
      <div>
        <p>{`是否确认修改小文章: < ${data.title} >?`}</p>
      </div>
    ), '确认')
    .ok(() => {
      this.doUpdate(data);
    });
  }

  async doUpdate(data) {
    try {
      this.setState({ loading: true });
      await axios({
        method: 'POST',
        url: '/api/blog/article/update',
        data: {
          id: this.id,
          article: data
        }
      });
      msgbox.showMessage((
        <div>
          <p>修改成功</p>
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

  async fetchArticle() {
    try {
      this.setState({ loading: true });
      const meta = await axios({
        url: `/api/blog/article/${this.id}`
      });
      const { title, route, shortName, content, bgColor, bgUrl } = meta.data;
      this.setState({
        article: {
          title, route, shortName, content, bgColor, bgUrl
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
        <h3 className="ui header">编辑小文章</h3>
        <EditArticle article={this.state.article} submit={data => this.doSubmit(data)} />
        <Loading show={this.state.loading} />
      </div>
    );
  }
}
