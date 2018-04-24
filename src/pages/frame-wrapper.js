import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Frame from 'common/components/frame';

@withRouter
@inject('base')
@observer
export default class FrameWrapper extends Component {
  render() {
    const { base } = this.props;
    return (
      <Frame activeIndex={base.activeIndex} fullscreen={base.fullscreen}>
        {this.props.children}
      </Frame>
    );
  }
}
