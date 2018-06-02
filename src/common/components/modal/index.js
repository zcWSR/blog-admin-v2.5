import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import autobind from 'autobind-decorator';

class Modal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dialogTop: 0,
      long: false
    };
  }

  componentDidMount() {
    this.adjustDialogTop();
    this.adjustScrolling();
  }

  componentDidUpdate(prevProps, prevState) {
    this.adjustDialogTop(prevState);
    this.adjustScrolling(prevState);
  }

  @autobind
  onCancel() {
    const { cancel, hideAfterCancel, onToggle } = this.props;
    if (typeof cancel === 'function') {
      cancel();
    }
    if (hideAfterCancel) {
      onToggle(false);
    }
  }

  @autobind
  onOk() {
    const { ok, hideAfterOk, onToggle } = this.props;
    if (typeof ok === 'function') {
      ok();
    }
    if (hideAfterOk) {
      onToggle(false);
    }
  }

  @autobind
  hide(e) {
    if (!e.target.classList.contains('modals')) {
      return;
    }
    this.props.onToggle(false);
  }

  adjustDialogTop(prevState) {
    setTimeout(() => {
      if (!this.dialogDom) {
        return;
      }
      const dialogHeight = this.dialogDom.offsetHeight;
      const dialogTop = 0 - Math.floor(dialogHeight / 2);
      if (prevState && (prevState.long || dialogTop === prevState.dialogTop)) {
        return;
      }
      this.setState({
        dialogTop,
        long: false
      });
    }, 20);
  }

  adjustScrolling(prevState) {
    setTimeout(() => {
      if (!this.dialogDom) {
        return;
      }
      const dialogHeight = this.dialogDom.offsetHeight;
      const windowHeight = window.innerHeight - 200;
      const longValue = dialogHeight > windowHeight;
      if (prevState && prevState.long === longValue) {
        return;
      }
      this.setState({
        long: longValue
      });
    }, 20);
  }

  renderFooter() {
    if (this.props.footer) {
      return (
        <div className="actions">
          {this.props.footer}
        </div>
      );
    }
    if (this.props.defaultFooter) {
      return (
        <div className="actions">
          {
            this.props.noCancel ? null : (
              <div className="ui black deny button" onClick={this.onCancel}>
                取消
              </div>
            )
          }
          {
            this.props.noOk ? null : (
              <div className="ui positive right labeled icon button" onClick={this.onOk}>
                确定
                <i className="checkmark icon" />
              </div>
            )
          }
        </div>
      );
    }
    return null;
  }

  renderBody() {
    const { sizeType, noSchema, header, content } = this.props;
    const clz = cx(`ui ${sizeType} test modal transition visible active animating fade in`, { scrolling: this.state.long });
    const style = { marginTop: this.state.dialogTop, display: 'block !important' };
    if (noSchema) {
      return (
        <div className={clz} style={style} ref={(dom) => { this.dialogDom = dom; }} >
          {content}
        </div>
      );
    }
    return (
      <div className={clz} style={style} ref={(dom) => { this.dialogDom = dom; }} >
        <div className="header">
          {header}
        </div>
        {/* <div className="content" style={{ maxHeight: '65vh', overflow: 'scroll' }}> */}
        <div className="content" style={{ maxHeight: '65vh' }}>
          {content}
        </div>
        {this.renderFooter()}
      </div>
    );
  }

  render() {
    const modalClz = cx('ui dimmer modals page transition animating fade in active', { visible: this.props.show });
    return (
      <div className={modalClz} style={{ display: 'none', overflow: this.state.long ? 'auto' : 'hidden' }} onClick={this.hide}>
        {this.renderBody()}
      </div>
    );
  }
}

Modal.defaultProps = {
  show: false,
  hideAfterCancel: true,
  hideAfterOk: true,
  noSchema: false,
  defaultFooter: true,
  noCancel: false,
  noOk: false,
  sizeType: 'standard'
};

Modal.propTypes = {
  show: PropTypes.bool
};

export default Modal;
