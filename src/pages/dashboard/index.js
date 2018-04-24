import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import Store from './store';

// import classnames from 'classnames';
import './index.less';

@inject('base')
@observer
export default class DashBoard extends Component {
  constructor() {
    super();
    document.title = 'dashboard';
    this.store = new Store();
    this.store.init();
  }
  componentDidMount() {
    console.log(this.props.base.activeIndex);
    this.props.base.changeActiveIndex(1);
  }
  render() {
    const { topIcon, greeting, motto } = this.store;
    console.log(motto);

    return (
      <div className="ui grid dashboard">
        <DevTools />
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
