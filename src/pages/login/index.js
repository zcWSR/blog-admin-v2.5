import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@inject('base')
@observer
export default class Login extends Component {
  constructor() {
    super();
    document.title = '登录';
  }
  componentDidMount() {
    this.props.base.changeActiveIndex(2);
  }
  render() {
    return (<div>login</div>);
  }
}
