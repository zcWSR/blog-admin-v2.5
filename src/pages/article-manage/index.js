import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import autobind from 'autobind-decorator';

import Loading from 'common/components/loading';
import msgbox from 'common/components/message-box';

import PostTabel from './table';

@inject('base', 'routing')
@observer
export default class ArticleManage extends Component {
  constructor(props) {
    super(props);
    document.title = '小文章管理';
    props.base.changeActiveIndex(31);
    this.state = {
      loading: false,
      articles: []
    };
  }

  componentDidMount() {
    this.doSearch();
  }

  async doSearch() {
    try {
      this.setState({ loading: true });
      const meta = await axios({
        url: '/api/blog/articles'
      });
      this.setState({
        articles: meta.data
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  @autobind
  edit(post) {
    this.props.routing.push(`/modify-article/${post.id}`);
  }

  @autobind
  lock(article) {
    msgbox.showMessage((
      <div>
        <p>{`小文章: ${article.title}`}</p>
        <p>{`是否确认${article.lock ? '解除' : ''}锁定?`}</p>
      </div>
    ), '确认')
    .ok(() => {
      this.doLock(article.id, !article.lock);
    });
  }

  async doLock(id, lock) {
    try {
      this.setState({ loading: true });
      await axios({
        method: 'POST',
        url: '/api/blog/article/lock',
        data: { id, lock }
      });
      this.doSearch();
    } catch (e) {
      this.setState({ loading: true });
    }
  }

  @autobind
  delete(article) {
    msgbox.showMessage((
      <div>
        <p>{`文章: ${article.title}`}</p>
        <p>{'是否确认删除?'}</p>
      </div>
    ), '确认')
    .ok(() => {
      this.doDelete(article.id);
    });
  }

  async doDelete(id) {
    try {
      this.setState({ loading: true });
      await axios({
        method: 'POST',
        url: '/api/blog/article/delete',
        data: { id }
      });
      this.doSearch();
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, articles } = this.state;
    return (
      <div>
        <h3 className="ui header">小文章管理</h3>
        <PostTabel data={articles} edit={this.edit} lock={this.lock} delete={this.delete} />
        <Loading show={loading} />
      </div>
    );
  }
}
