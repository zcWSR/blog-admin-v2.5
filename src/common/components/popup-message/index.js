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
  }

  LONG = 1000 * 3;
  SHORT = 1000 * 2;

  show(params) {
    let delayTime = this.SHORT;
    const nextState = {};
    if (typeof params === 'string') {
      nextState.color = 'teal';
      nextState.title = params;
      nextState.content = '';
    } else {
      const { color, title, content, delay } = params;
      delayTime = delay;
      nextState.color = color;
      nextState.title = title;
      nextState.content = content;
      nextState.delay = delay;
    }
    this.setState({ display: true }, () => {
      setTimeout(() => {
        this.setState(nextState, () => {
          this.setState({ show: true });
        });
      }, 0);
    });
    setTimeout(() => {
      this.hide();
    }, delayTime);
  }

  @autobind
  hide() {
    if (this.state.show) {
      this.setState({ show: false });
      setTimeout(() => {
        this.setState({ display: false });
      }, 300);
    }
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
        {!!title && <div className="header">{title}</div>}
        {!!content && <p>{content}</p>}
      </div>
    );
  }
}
