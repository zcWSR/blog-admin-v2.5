import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@observer
@inject('base')
export default class Login extends Component {
  componentDidMount() {
    this.props.base.changeActiveIndex(2);
  }
  render() {
    return (<div>login</div>);
  }
}
