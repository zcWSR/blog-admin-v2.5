import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'tiny-cookie';
import { isNil, noop } from 'lodash';
import DropDown from 'app/common/dropdown';

class SystemSelector extends Component {

  constructor() {
    super();
    this.state = {
      data: [],
      value: cookie.get('system_id')
    };
  }

  componentDidMount() {
    axios.get('/system/list-for-user')
      .then((response) => {
        const data = response.data.map(item => ({
          ...item,
          text: item.name,
          value: item.id
        }));
        this.setState({
          data
        });
      });
  }

  onChange = (value) => {
    cookie.set('system_id', value);
    if (this.isControlled()) {
      this.props.onChange(value);
    } else {
      this.setState({
        value
      }, () => {
        this.props.onChange(value);
      });
    }
  }

  value() {
    return this.state.value;
  }

  isControlled() {
    return !isNil(this.props.value);
  }

  render() {
    const { data } = this.state;
    const value = this.isControlled() ? this.props.value : this.state.value;
    const dropdownProps = {
      data,
      onChange: this.onChange,
      value,
      style: this.props.style
    };
    return (
      <DropDown
        {...dropdownProps}
      />
    );
  }

}

SystemSelector.defaultProps = {
  data: [],
  onChange: noop,
  style: { width: 180 }
};

export default SystemSelector;
