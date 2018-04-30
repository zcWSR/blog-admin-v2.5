import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import cn from 'classnames';
import axios from 'axios';
import autobind from 'autobind-decorator';

import Loading from 'common/components/loading';
import Pager from 'common/components/pager';
import msgbox from 'common/components/message-box';

import PostTabel from './table';

@inject('base', 'routing')
@observer
export default class PostManage extends Component {
  constructor(props) {
    super(props);
    props.base.changeActiveIndex(11);
    document.title = '博客文章管理';
    this.state = {
      loading: false,
      searchContent: '',
      showLock: true,
      posts: [],
      pageSize: 10,
      curPage: 1,
      totalCount: 0
    };
  }

  componentDidMount() {
  }

  @autobind
  async doSearch(curPage) {
    this.setState({ loading: true });
    const meta = await axios({
      url: '/api/blog/posts/search',
      params: {
        pageSize: this.state.pageSize,
        curPage: curPage || 1,
        withLock: this.state.showLock,
        content: this.state.searchContent
      }
    });
    const { list, totalCount, pageSize } = meta.data;
    this.setState({
      loading: false,
      posts: list,
      totalCount,
      pageSize,
      curPage: meta.data.curPage
    });
  }

  @autobind
  edit(post) {
    this.props.routing.push(`/edit-post/${post.id}`);
  }

  @autobind
  lock(post) {
    msgbox.showMessage((
      <div>
        <p>{`文章: ${post.title}`}</p>
        <p>{`是否确认${post.lock ? '解除' : ''}锁定?`}</p>
      </div>
    ), '确认')
    .ok(() => {
      this.doLock(post.id, !post.lock);
    });
  }

  async doLock(id, lock) {
    try {
      this.setState({ loading: true });
      await axios({
        method: 'POST',
        url: '/api/blog/posts/lock',
        data: { id, lock }
      });
      this.doSearch();
    } catch (e) {
      this.setState({ loading: true });
    }
  }

  @autobind
  delete(post) {
    msgbox.showMessage((
      <div>
        <p>{`文章: ${post.title}`}</p>
        <p>{'是否确认删除?'}</p>
      </div>
    ), '确认')
    .ok(() => {
      this.doDelete(post.id);
    });
  }

  async doDelete(id) {
    try {
      this.setState({ loading: true });
      await axios({
        method: 'POST',
        url: '/api/blog/posts/delete',
        data: { id }
      });
      this.doSearch();
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, searchContent, showLock, posts, curPage, totalCount, pageSize } = this.state;
    const showLockClz = cn('ui toggle checkbox', { checked: showLock });
    return (
      <div>
        <h3 className="ui header">博客文章管理</h3>
        <div className="ui form vertical segment search">
          <div className="inline fields">
            <div className="inline fields">
              <label>搜索内容</label>
              <div className="field">
                <div className="ui icon input">
                  <input
                    value={searchContent.trim()}
                    onChange={evt =>
                      this.setState({
                        searchContent: evt.target.value
                      })
                    }
                  />
                  {searchContent && (
                    <i
                      className="cancel link icon"
                      onClick={() => this.setState({ searchContent: '' })}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="inline fields">
              <div className={showLockClz} onClick={() => this.setState({ showLock: !showLock })}>
                <input type="checkbox" readOnly checked={showLock} />
                <label>{`${showLock ? '' : '不'}显示锁定的文章`}</label>
              </div>
            </div>
          </div>
          <button className="ui button primary" onClick={() => this.doSearch()}>搜索</button>
        </div>
        <PostTabel data={posts} edit={this.edit} lock={this.lock} delete={this.delete} />
        <Pager
          curPage={curPage}
          totalCount={totalCount} pageSize={pageSize}
          clickHandler={this.doSearch}
        />
        <Loading show={loading} />
      </div>
    );
  }
}
