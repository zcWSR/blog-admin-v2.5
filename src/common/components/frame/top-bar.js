import React, { Component } from 'react';
import classnames from 'classnames';
import autobind from 'autobind-decorator';

export default class TopBar extends Component {
  @autobind
  logout() {
    if (typeof this.props.onLogout === 'function') {
      this.props.onLogout();
    }
  }

  // componentDidMount() {
  //   this.setState({ username: cookie.get('qsso_user_name') });
  // }

  render() {
    const pageContentClz = classnames('ui fixed icon menu top-bar', { toggle: this.props.toggle });
    return (
      <div className={pageContentClz}>
        <div className="left menu">
          <a className="item" onClick={this.props.onToggleBtnClick}><i className="content icon large" /></a>
        </div>
        <div className="right menu">
          <a className="item username"><i className="user icon large" />&nbsp;&nbsp;{this.props.username}</a>
          <a className="item" onClick={this.logout}><i className="sign out icon large " /></a>
        </div>
      </div>
    );
  }
}

TopBar.propTypes = {
  onToggleBtnClick: React.PropTypes.func.isRequired,
  toggle: React.PropTypes.bool.isRequired
};
