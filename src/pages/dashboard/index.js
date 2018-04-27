import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import Loading from 'common/components/loading';
import RankTable from './rank-table';
// import classnames from 'classnames';
import './index.less';

@inject('base', 'dashboard')
@observer
export default class DashBoard extends Component {
  constructor() {
    super();
    document.title = 'dashboard';
  }
  componentDidMount() {
    const { dashboard, base } = this.props;
    base.changeActiveIndex(1);
    dashboard.init();
    setInterval(() => {
      dashboard.getServerStatus();
    }, 30000);
  }
  render() {
    const {
      topIcon,
      greeting,
      motto,
      totalView,
      todayView,
      memory,
      memoryVirtual,
      cpu,
      viewRank,
      loading
    } = this.props.dashboard;

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

        <div className="ui divider" />

        <div className="four column row cards">
          <div className="column">
            <div className="ui card" style={{ width: '100%' }}>
              <div className="content">
                <div className="header">总文章浏览数</div>
                <div className="discription">
                  <p className="main-disc">
                    {totalView}
                    <span className="unit">次</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="ui card" style={{ width: '100%' }}>
              <div className="content">
                <div className="header">今日浏览数</div>
                <div className="discription">
                  <p className="main-disc">
                    {todayView}
                    <span className="unit">个</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="ui card" style={{ width: '100%' }}>
              <div className="content">
                <div className="header">CPU占用</div>
                <div className="discription">
                  <p className="main-disc">
                    {cpu}
                    <span className="unit">%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="ui card" style={{ width: '100%' }}>
              <div className="content">
                <div className="header">内存占用</div>
                <div className="discription">
                  <p className="main-disc">
                    {memory}
                    <span className="unit">MB</span>
                  </p>
                  <p className="sub-disc">
                    虚拟内存&nbsp;&nbsp;{memoryVirtual}
                    <span className="unit">MB</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row charts_1">
          <div className="twelve wide column">
            <RankTable
              title={'近30日job失败次数排行榜'}
              data={viewRank}
            />
          </div>
          {/* <div className="four wide column">
            <div className="ui segment">
              <h3 className="ui header">资源使用率</h3>
              <Gauge data={gauge.current} max={gauge.max} name={''} />
            </div>
          </div> */}
        </div>
        <Loading show={loading} />
      </div>
    );
  }
}
