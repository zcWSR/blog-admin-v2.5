import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@observer
@inject('base')
export default class NotFound extends Component {
  componentDidMount() {
    this.props.base.changeActiveIndex(0);
  }
  render() {
    return (<div>opps</div>);
  }
}
