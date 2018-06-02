import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import autobind from 'autobind-decorator';
import axios from 'axios';
import cookie from 'tiny-cookie';
import Frame from 'common/components/frame';


@withRouter
@inject('base', 'routing')
@observer
export default class FrameWrapper extends Component {
  @autobind
  async onLogout() {
    await axios({
      method: 'POST',
      url: 'api/blog/admin/logout',
      data: {
        username: cookie.get('username')
      }
    });
    cookie.remove('token');
    cookie.remove('username');
    this.props.base.changeUsername('');
    this.props.routing.push('/login');
  }
  render() {
    const { base } = this.props;
    return (
      <Frame
        activeIndex={base.activeIndex}
        fullscreen={base.fullscreen}
        username={base.username}
        onLogout={this.onLogout}
      >
        {this.props.children}
      </Frame>
    );
  }
}
