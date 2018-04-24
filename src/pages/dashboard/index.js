import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Store from './store';
// import classnames from 'classnames';

import './index.less';

@observer
@inject('base')
export default class DashBoard extends Component {
  constructor() {
    super();
    this.store = new Store();
    this.store.init();
  }
  componentDidMount() {
    this.props.base.changeActiveIndex(1);
  }
  render() {
    const { topIcon, greeting, motto } = this.store;
    console.log(motto);

    return (
      <div className="ui grid dashboard">
        <div className="row topbar">
          <div className="ten wide column">
            <i className={`icon ${topIcon}`} />
            <div className="greetings">
              <p className="hello">
                {greeting}
              </p>
              <p className="motto">{motto}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
