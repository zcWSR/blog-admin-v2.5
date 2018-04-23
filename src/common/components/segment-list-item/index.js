import React, { Component } from 'react';
import { noop } from 'lodash';
import autobind from 'autobind-decorator';

/**
 * usage:
 *  const config = {
 *    positiveBtn: true,
 *    negativeBtn: false,
 *    positiveBtnTxt: 'Add',
 *    negativeBtnTxt: 'Remove'
 *  };
 *  <SegmentListItem
 *    config={config}
 *    onClickPositive={() => this.onClickPositive()}
 *    onClickNegative={() => this.onClickNegative()}
 *  >
 *    // some children components ...
 *  </SegmentListItem>
 */

export default class SegmentListItem extends Component {

  static defaultProps = {
    config: {
      positiveBtn: true,
      negativeBtn: true,
      positiveBtnTxt: '',
      negativeBtnTxt: ''
    },
    onClickPositive: noop,
    onClickNegative: noop
  };

  @autobind
  onPositiveBtnClick() {
    this.props.onClickPositive();
  }

  @autobind
  onNegativeBtnClick() {
    this.props.onClickNegative();
  }

  getDivider() {
    const { positiveBtn, negativeBtn } = this.props.config;
    let dividerNode = null;
    if (this.props.children.length && (positiveBtn || negativeBtn)) {
      dividerNode = (<div className="ui divider" />);
    }
    return dividerNode;
  }

  getButtons() {
    const { positiveBtn, negativeBtn, positiveBtnTxt, negativeBtnTxt } = this.props.config;
    let btnContainerNode = null;
    let positiveBtnNode = null;
    let negativeBtnNode = null;
    if (positiveBtn) {
      positiveBtnNode = (
        <button className="ui right labeled icon positive button" onClick={this.onPositiveBtnClick}>
          <i className="plus icon" />
          {positiveBtnTxt}
        </button>
      );
    }
    if (negativeBtn) {
      negativeBtnNode = (
        <button className="ui labeled icon negative button" onClick={this.onNegativeBtnClick}>
          <i className="minus icon" />
          {negativeBtnTxt}
        </button>
      );
    }
    if (positiveBtn || negativeBtn) {
      btnContainerNode = (
        <div className="inline field" style={{ float: 'right' }}>
          {negativeBtnNode}
          {positiveBtnNode}
        </div>
      );
    }
    return btnContainerNode;
  }

  render() {
    return (
      <div className="ui grey segment clearing">
        { this.props.children }
        { this.getDivider() }
        { this.getButtons() }
      </div>
    );
  }

}
