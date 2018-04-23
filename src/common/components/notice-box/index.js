import React, { Component } from 'react';
import cx from 'classnames';
import { isArray } from 'lodash';

class NoticeBox extends Component {


  componentDidMount() {
  }

  render() {
    const {
      header,
      info,
      type,
      show
    } = this.props;
    const infoElements = [];
    if (isArray(info)) {
      info.forEach(text => (
        infoElements.push(<li>{text}</li>)
      ));
    } else {
      infoElements.push(<li>{info}</li>);
    }
    const clz = cx('ui message', type);
    const display = show ? 'block' : 'none';
    return (
      <div className={clz} style={{ display }}>
        <div className="header">
          {header}
        </div>
        <ul className="list">
          {infoElements}
        </ul>
      </div>
    );
  }
}

NoticeBox.defaultProps = {
  show: false,
  type: 'error',
  header: '',
  info: []
};

export default NoticeBox;
