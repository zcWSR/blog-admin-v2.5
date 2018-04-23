import React, { Component } from 'react';
import classnames from 'classnames';

export default class Menu extends Component {
  constructor() {
    super();
    this.state = {
      data: [
        {
          text: '首页',
          children: [
            {
              id: 1,
              text: 'DASHBOARD',
              url: '/fe/dashboard'
            }
            // ,{
            //   id: 2,
            //   text: '我的Job',
            //   url: '/fe/my-job'
            // }
          ]
        },
        {
          text: '基础信息管理',
          children: [
            {
              id: 11,
              text: '基础信息',
              url: '/fe/basic-info'
            },
            {
              id: 12,
              text: '创建Job',
              url: '/fe/create-job'
            }
          ]
        },
        {
          text: '任务管理',
          children: [
            {
              id: 21,
              text: '任务队列管理',
              url: '/fe/task-manage/queue'
            },
            {
              id: 22,
              text: '任务执行管理',
              url: '/fe/task-manage/running'
            },
            {
              id: 23,
              text: '历史记录管理',
              url: '/fe/task-manage/history'
            }
          ]
        },
        {
          text: '任务统计',
          children: [
            {
              id: 31,
              text: '未完成统计查询',
              url: '/fe/task-manage/unfinished'
            }
          ]
        }
      ]
    };
  }

  componentDidMount() {}

  getContent() {
    return this.state.data.map((head, i) => {
      const items = head.children.map((item) => {
        const itemClz = classnames('item', { 'active teal': item.id === this.props.activeIndex });
        if (item.id === this.props.activeIndex) {
          return (
            <div className={itemClz} key={item.id}>
              {item.text}
            </div>
          );
        }
        return (
          <a className={itemClz} key={item.id} href={item.url}>
            {item.text}
          </a>
        );
      });
      return (
        <div className="item" key={`items${i + 1}`}>
          <div className="ui small inverted header">
            {head.text}
            <i className="settings icon" />
          </div>
          <div className="menu">{items}</div>
        </div>
      );
    });
  }

  render() {
    const classNames = classnames(
      'ui left vertical inverted labeled sidebar menu nav-menu overlay animating',
      { visible: !this.props.toggle }
    );
    const content = this.getContent();
    return (
      <div className={classNames}>
        <div className="nav-menu-title">
          <h1>大住宿任务调度系统</h1>
          <h2>DZS TASK DISPATCH SYS</h2>
        </div>
        {this.props.hideMenu || content}
      </div>
    );
  }
}
