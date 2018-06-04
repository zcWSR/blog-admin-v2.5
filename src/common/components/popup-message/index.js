import React, { Component } from 'react';
import cn from 'classnames';
import autobind from 'autobind-decorator';

export default class PopupMessage extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      content: '',
      color: 'teal',
      show: false,
      display: false
    };

    this.timeOuter = null;
  }

  LONG = 1000 * 3;
  SHORT = 1000 * 10;

  show(title, color, time, content) {
    this.setState({ display: true, color: color || 'teal', title, content }, () => {
      this.setState({ show: true });
    });
    this.timeOuter = setTimeout(() => {
      this.hide();
    }, time || PopupMessage.SHORT);
  }

  @autobind
  hide() {
    clearTimeout(this.timeOuter);
    this.setState({ show: false });
    setTimeout(() => {
      this.setState({ display: false });
    }, 300);
  }

  render() {
    const { content, color, title, show, display } = this.state;
    const msgClz = cn('ui message', color);
    return (
      <div
        className={msgClz}
        style={{
          zIndex: 100,
          position: 'fixed',
          width: 300,
          display: display ? 'block' : 'none',
          left: '50%',
          bottom: show ? 5 : '-100%',
          transform: 'translateX(-50%)',
          transition: 'bottom .3s ease-in-out'
        }}
      >
        <i className="close icon" onClick={this.hide} />
        <div className="header">{title || content}</div>
        {!!content && <p>{content}</p>}
      </div>
    );
  }
}
