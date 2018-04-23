import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { isFunction, identity, keyBy } from 'lodash';
import autobind from 'autobind-decorator';

class MultiSelect extends Component {

  constructor() {
    super();
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
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

  onItemClick(itemData, e) {
    e.stopPropagation();
    if (isFunction(this.props.onSelected)) {
      this.props.onSelected(itemData);
    }
    if (isFunction(this.props.onChange)) {
      this.props.onChange(this.getValueAdded(itemData));
    }
  }

  onSelectedItemClick(e, itemData) {
    e.stopPropagation();
    if (isFunction(this.props.onUnselected)) {
      this.props.onUnselected(itemData);
    }
    if (isFunction(this.props.onChange)) {
      this.props.onChange(this.getValueRemoved(itemData));
    }
  }

  getValueAdded(itemData) {
    const result = this.props.value.map(identity);
    result.push(itemData.value);
    return result;
  }

  getValueRemoved(itemData) {
    return this.props.value.filter(value => (value !== itemData.value && value !== `${itemData.value}`));
  }

  getSelectedMap() {
    return this.props.value.reduce((result, item) => {
      // eslint-disable-next-line
      result[item] = true;
      return result;
    }, {});
  }

  renderSelected() {
    const map = keyBy(this.props.data, 'value');
    const selectedItems = this.props.value.map(value => (
      map[value] || { text: value, value, error: true }
    ));
    return selectedItems.map((item) => {
      const clz = classnames('ui label transition visible', { red: item.error });
      return (<a
        className={clz}
        key={item.value}
        style={{ display: 'inline-block !important' }}
        onClick={e => (this.onSelectedItemClick(e, item))}
      >
        {item.text}<i className="delete icon" />
      </a>);
    });
  }

  renderUnselected() {
    const map = this.getSelectedMap();
    const unselectedItems = this.props.data.reduce((result, item) => {
      if (!map[item.value]) {
        result.push(item);
      }
      return result;
    }, []);
    return unselectedItems.map((item, key) => (
      // eslint-disable-next-line react/no-array-index-key
      <div className="item" data-value={item.value} key={key} onClick={e => (this.onItemClick(item, e))}>{item.text}</div>
    ));
  }

  render() {
    const classNames = classnames('ui fluid dropdown selection multiple', {
      'active visible': this.state.visible
    });
    const menuClassNames = classnames('menu', {
      visible: this.state.visible
    });
    const menuStyle = { display: 'none' };
    if (this.state.visible) {
      menuStyle.display = 'block';
    }

    // handle warning
    const props = Object.assign({}, this.props);
    delete props.onSelected;
    delete props.onUnselected;
    delete props.onChange;
    delete props.data;

    return (
      <div className={classNames} onClick={this.onContainerClick} {...props} >
        <i className="dropdown icon" />
        {this.renderSelected()}
        <div className="default text">{this.props.placeholder}</div>
        <div className={menuClassNames} style={menuStyle}>
          {this.renderUnselected()}
        </div>
      </div>
    );
  }

}

MultiSelect.defaultProps = {
  data: [],
  value: []
};

export default MultiSelect;
