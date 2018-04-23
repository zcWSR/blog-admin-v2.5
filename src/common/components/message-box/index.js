import React, { Component } from 'react';
import ReactDom from 'react-dom';
import autobind from 'autobind-decorator';
import { noop } from 'lodash';
import Modal from '../modal';

const contentWrapper = content => (
  <div style={{ wordBreak: 'break-word' }}>
    {content}
  </div>
);

class MessageBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      content: null,
      title: '提示',
      isConfirm: false
    };
    this.confirmCancel = noop;
    this.confirmOk = noop;
  }

  @autobind
  toggle(show) {
    this.setState({
      show
    });
  }

  @autobind
  cancel() {
    if (this.state.isConfirm) {
      this.confirmCancel();
      this.confirmCancel = noop;
    }
  }

  @autobind
  ok() {
    this.confirmOk();
    this.confirmOk = noop;
  }

  showMessage(content, title) {
    this.setState({
      content: contentWrapper(content),
      title: title || '提示',
      isConfirm: false,
      show: true
    });
    return {
      ok: (fn) => {
        this.confirmOk = fn;
      }
    };
  }

  showConfirm(content, title) {
    this.setState({
      content: contentWrapper(content),
      title: title || '请确认',
      isConfirm: true,
      show: true
    });
    return this.confirmBind();
  }

  confirmBind() {
    const result = {
      ok: (fn) => {
        this.confirmOk = fn;
        return result;
      },
      cancel: (fn) => {
        this.confirmCancel = fn;
        return result;
      }
    };
    return result;
  }

  render() {
    const modalProps = {
      show: this.state.show,
      onToggle: this.toggle,
      content: this.state.content,
      header: this.state.title,
      cancel: this.cancel,
      ok: this.ok,
      noCancel: !this.state.isConfirm,
      sizeType: 'small'
    };
    return (
      <Modal {...modalProps} />
    );
  }

}

const container = document.createElement('div');
document.body.appendChild(container);

export default ReactDom.render(
  <MessageBox />,
  container
);
