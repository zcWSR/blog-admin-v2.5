import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { isFunction, isNil } from 'lodash';
import autobind from 'autobind-decorator';

class Dropdown extends Component {

  constructor() {
    super();
    this.state = {
      visible: false
    };
  }

  componentWillMount() {
    // 默认选择第一项
    if (this.props.placeholder === undefined && this.props.data.length > 0 &&
      isNil(this.props.value)) {
      this.fireSelected(this.props.data[0]);
    }
    this.onDocumentClickBind = this.onDocumentClick.bind(this);
    document.addEventListener('click', this.onDocumentClickBind);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClickBind);
  }

  onDocumentClick(e) {
    // eslint-disable-next-line react/no-find-dom-node
    const dom = ReactDOM.findDOMNode(this);
    if (dom.contains(e.target)) {
      return;
    }
    this.setState({ visible: false });
  }

  @autobind
  onContainerClick() {
    this.setState({ visible: !this.state.visible });
  }

  onItemClick(itemData) {
    const prevSelected = { ...this.state.selected };
    this.setState({ visible: false });
    this.setState({ selected: itemData }, () => {
      this.fireSelected(itemData, prevSelected);
    });
  }

  fireSelected(itemData, prevItemData) {
    if (isFunction(this.props.onSelected)) {
      this.props.onSelected(itemData, prevItemData);
    }
    if (isFunction(this.props.onChange)) {
      this.props.onChange(itemData.value);
    }
  }

  renderItems() {
    return this.props.data.map((item, key) => (
      // eslint-disable-next-line react/no-array-index-key
      <div className="item" data-value={item.value} key={key} onClick={() => (this.onItemClick(item))}>{item.text}</div>
    ));
  }

  render() {
    const classNames = classnames('ui selection dropdown', {
      'active visible': this.state.visible,
      disabled: this.props.disabled
    });
    const menuClassNames = classnames('menu', {
      visible: this.state.visible
    });
    const menuStyle = { display: 'none' };
    if (this.state.visible) {
      menuStyle.display = 'block';
    }
    const value = this.props.value;
    const selected = this.props.data.find(item => (
      item.value === value || item.value === `${value}`
    ));
    let placeholder = (<div className="text" />);
    if (selected) {
      placeholder = (<div className="text">{selected.text}</div>);
    } else if (this.props.placeholder !== undefined) {
      placeholder = (<div className="default text">{this.props.placeholder}</div>);
    }
    const props = Object.assign({}, this.props);
    delete props.onSelected;
    delete props.onChange;
    delete props.data;

    return (
      <div
        className={classNames}
        style={{ minWidth: 0 }}
        onClick={this.onContainerClick}
        {...props}
      >
        <i className="dropdown icon" />
        {placeholder}
        <div className={menuClassNames} style={menuStyle}>
          {this.renderItems()}
        </div>
      </div>
    );
  }

}

Dropdown.defaultProps = {
  data: []
};

export default Dropdown;
