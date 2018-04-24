import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@inject('base')
@observer
export default class NotFound extends Component {
  constructor() {
    super();
    document.title = 'oops! page not found';
  }
  componentDidMount() {
    this.props.base.changeActiveIndex(0);
  }
  render() {
    return (<div>oops</div>);
  }
}
