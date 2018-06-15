import React, { Component, PropTypes } from 'react';
import withImportantStyle from 'react-with-important-style';
import cx from 'classnames';
import autobind from 'autobind-decorator';

const MyDiv = withImportantStyle('div');

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      animateIn: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.show !== nextProps.show) {
      if (nextProps.show) {
        this.setState({
          show: true,
          animateIn: true
        });
      } else {
        this.setState({ animateIn: false });
      }
    }
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
  onAnimationEnd() {
    console.log('animation end');
    if (!this.state.animateIn) {
      this.setState({ show: false });
    }
  }

  @autobind
  hide(e) {
    if (!e.target.classList.contains('modals')) {
      return;
    }

    this.props.onToggle(false);
  }


  renderFooter() {
    if (this.props.footer) {
      return <div className="actions">{this.props.footer}</div>;
    }
    if (this.props.defaultFooter) {
      return (
        <div className="actions">
          {this.props.noCancel ? null : (
            <div className="ui black deny button" onClick={this.onCancel}>
              取消
            </div>
          )}
          {this.props.noOk ? null : (
            <div className="ui positive right labeled icon button" onClick={this.onOk}>
              确定
              <i className="checkmark icon" />
            </div>
          )}
        </div>
      );
    }
    return null;
  }

  renderBody() {
    const { sizeType, noSchema, header, content, long } = this.props;
    const { show, animateIn } = this.state;
    const clz = cx('ui test modal transition visible active animating scale', sizeType, {
      in: animateIn,
      out: !animateIn,
      visible: show,
      hidden: !show,
      longer: long
    });
    const contentClz = cx('content', { scrolling: long });
    const style = { display: 'block !important' };
    if (noSchema) {
      return (
        <div
          className={clz}
          style={style}
          ref={(dom) => {
            this.dialogDom = dom;
          }}
        >
          {content}
        </div>
      );
    }
    return (
      <div
        className={clz}
        style={style}
        ref={(dom) => {
          this.dialogDom = dom;
        }}
      >
        <div className="header">{header}</div>
        {/* <div className="content" style={{ maxHeight: '65vh', overflow: 'scroll' }}> */}
        <div className={contentClz}>{content}</div>
        {this.renderFooter()}
      </div>
    );
  }

  render() {
    const { show, animateIn } = this.state;
    const modalClz = cx('ui dimmer modals page transition animating fade', {
      animateIn,
      out: !animateIn,
      active: show,
      visible: show,
      hidden: !show
    });
    return (
      <MyDiv
        className={modalClz}
        style={{
          display: show ? 'flex !important' : ''
        }}
        onClick={this.hide}
        onAnimationEnd={this.onAnimationEnd}
      >
        {this.renderBody()}
      </MyDiv>
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
