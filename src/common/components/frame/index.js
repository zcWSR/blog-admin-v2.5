import React, { Component } from 'react';
import classnames from 'classnames';
import cookie from 'tiny-cookie';
import Menu from './menu';
import TopBar from './top-bar';
import './index.less';

class Frame extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toggle: cookie.get('toggle_menu') === 'true'
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      toggle: !this.state.toggle
    }, () => {
      cookie.set('toggle_menu', this.state.toggle, { expires: (new Date(32524724988935)).toGMTString() });
    });
  }

  render() {
    const pageContentClz = classnames('main pusher', { toggle: this.state.toggle, fullscreen: this.props.fullscreen });
    return (
      <div>
        <TopBar toggle={this.state.toggle} onToggleBtnClick={this.toggle} />
        <Menu
          activeIndex={this.props.activeIndex}
          toggle={this.state.toggle}
          hideMenu={this.props.hideMenu}
        />
        <section id="page-content" className={pageContentClz}>
          {this.props.children}
        </section>
      </div>
    );
  }

}

Frame.propTypes = {
  children: React.PropTypes.node.isRequired
};

export default Frame;
