import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import autobind from 'autobind-decorator';

class PageItem extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  @autobind
  clickHandler() {
    const props = this.props;
    if (!props.disabled &&
          typeof props.clickHandler !== 'undefined' &&
          props.curPage !== props.value) {
      props.clickHandler(props.value);
    }
  }

  render() {
    const optional = {};
    const props = this.props;
    const isCurrent = props.curPage === props.value;
    const classNames = cx('item', {
      active: isCurrent,
      disabled: props.disabled === true
    });

    return (
      <div
        className={classNames}
        onClick={this.clickHandler}
        {...optional}
      >
        {props.value}
      </div>
    );
  }
}

class CmdItem extends Component {

  static propTypes = {
    curPage: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    clickHandler: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.typeMap = {
      PREV: {
        el: (<i className="angle left icon" />)
      },
      NEXT: {
        el: (<i className="angle right icon" />)
      }
    };
  }

  @autobind
  clickHandler() {
    const { curPage, type, clickHandler, disabled } = this.props;
    let page;

    switch (type.toUpperCase()) {
      case 'PREV' : page = curPage - 1;
        break;
      case 'NEXT' : page = curPage + 1;
        break;
      default:
        break;
    }

    if (!disabled && typeof clickHandler === 'function') {
      clickHandler(page);
    }
  }

  render() {
    const props = this.props;
    const type = props.type.toUpperCase();
    const classNames = cx('item', { disabled: props.disabled });

    return (
      <li className={classNames} onClick={this.clickHandler}>
        {this.typeMap[type].el}
      </li>
    );
  }
}

class Pager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      curPage: 1,
      totalCount: 1,
      pageSize: 20,
      pageNum: null
    };
  }

  getCmdItem(type) {
    const { curPage, clickHandler } = this.props;
    const propsParts = {
      type,
      curPage,
      clickHandler
    };

    switch (type.toUpperCase()) {
      case 'PREV' : Object.assign(propsParts, { disabled: curPage <= 1 });
        break;
      case 'NEXT' : Object.assign(propsParts, { disabled: curPage >= this.pageCount() });
        break;
      default :
        break;
    }

    return (<CmdItem key={`${type}_${Math.random()}`} {...propsParts} />);
  }

  getItems() {
    const ret = [];
    const props = this.props;
    const curPage = props.curPage;
    const pageCount = this.pageCount();
    const totalCount = props.totalCount;
    const paginationClz = cx('ui pagination menu', { tiny: this.props.small });

    if (curPage <= 0 || pageCount <= 1 || totalCount <= 0) return null;

    ret.push(this.getCmdItem('PREV', pageCount));
    ret.push(<PageItem key="ui_pager_1" {...props} value={1} />);

    if (curPage > 3 && pageCount > 5) {
      ret.push(<PageItem key="ui_pager_prev_dot" {...props} value="..." disabled />);
    }

    const start = curPage < 4 ? 2 : curPage - 2;
    const end = curPage + 2 > pageCount - 1 ? pageCount - 1 : curPage + 2;
    let i = start;

    for (; i <= end; i += 1) {
      ret.push(<PageItem key={`ui_pager_${i}`} {...props} value={i} />);
    }

    if (curPage + 3 < pageCount && pageCount > 5) {
      ret.push(<PageItem key="ui_pager_next_dot" {...props} value={<i className="ellipsis horizontal icon" />} disabled />);
    }

    ret.push(<PageItem key={`ui_pager_${pageCount}`} {...props} value={pageCount} onChange={this.setPageNum} />);
    ret.push(this.getCmdItem('NEXT', pageCount));

    return (
      <div className="field">
        <div className={paginationClz}>
          {ret}
        </div>
      </div>
    );
  }

  @autobind
  setPageNum(evt) {
    this.setState({
      pageNum: evt.target.value
    });
  }

  getPageInfo() {
    const pageInfoClz = cx('ui action input', { small: this.props.small });

    if (this.props.totalCount <= 0) {
      return null;
    }

    if (this.props.totalCount <= this.props.pageSize) {
      return (
        <div className="field">
          <div className="ui label">
            总条数<div className="detail">{this.props.totalCount}</div>
          </div>
        </div>
      );
    }

    const pageNum = this.state.pageNum ? this.state.pageNum : '';

    return (
      <div className="field" >
        <div
          className={pageInfoClz}
          style={{ display: this.props.hideGotoBox ? 'none' : 'inline-flex' }}
        >
          <input
            className="pageNum"
            placeholder="页码"
            type="text"
            value={pageNum}
            onChange={this.setPageNum}
            style={{ width: '5em' }}
          />
          <button className="ui icon button" onClick={this.toSkip}>
            <i className="arrow right icon" />
          </button>
        </div>
        <div className="ui label">
          总条数<div className="detail">{this.props.totalCount}</div>
        </div>
      </div>
    );
  }

  pageCount() {
    const { totalCount, pageSize } = this.props;
    return Math.ceil(totalCount / pageSize);
  }

  @autobind
  toSkip(e) {
    e.preventDefault();
    const pageNum = this.state.pageNum;

    if (!/\d+/.test(pageNum) || pageNum > this.pageCount() || pageNum <= 0) {
      this.setState({
        pageNum: ''
      });
    } else if (typeof this.props.clickHandler === 'function') {
      this.props.clickHandler(parseInt(pageNum, 10));
    }
  }


  render() {
    const pageItems = this.getItems();
    const pagerInfo = this.getPageInfo();

    if (this.props.totalCount === 0) {
      return null;
    }

    return (
      <div className="ui form">
        <div className="inline fields">
          {pageItems}
          {pagerInfo}
        </div>
      </div>
    );
  }
}

Pager.propTypes = {
  curPage: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  clickHandler: PropTypes.func,
  small: PropTypes.bool,
  hideGotoBox: PropTypes.bool
};

Pager.defaultProps = {};

export default Pager;
