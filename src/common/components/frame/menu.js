import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

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
              url: '/dashboard'
            }
          ]
        },
        {
          text: '博文',
          children: [
            {
              id: 11,
              text: '博文管理',
              url: '/post-manage'
            },
            {
              id: 12,
              text: '创建博文',
              url: '/create-post'
            }
          ]
        },
        {
          text: '图片',
          children: [
            {
              id: 21,
              text: '图片管理',
              url: '/images'
            }
          ]
        },
        {
          text: '小文章',
          children: [
            {
              id: 31,
              text: '文章管理',
              url: '/article-manage'
            },
            {
              id: 32,
              text: '创建文章',
              url: '/create-article'
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
          <Link className={itemClz} key={item.id} to={item.url}>
            {item.text}
          </Link>
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
          <h1>博客管理系统</h1>
          <h2>{'blog manage system'.toLocaleUpperCase()}</h2>
        </div>
        {this.props.hideMenu || content}
      </div>
    );
  }
}
