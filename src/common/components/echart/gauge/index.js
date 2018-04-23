import React, { Component } from 'react';
import echart from 'echarts';
import elementResizeEvent from 'element-resize-event';
import { isFunction } from 'lodash';
import 'echarts/lib/echarts';
import 'echarts/lib/chart/gauge';

export default class Gauge extends Component {
  constructor() {
    super();
    this.echartInstance = null;
  }

  componentDidMount() {
    this.echartInstance = echart.init(this.refs.dom);
    elementResizeEvent(this.refs.dom, () => {
      this.echartInstance.resize();
    });
    this.reRender();
  }

  componentWillReceiveProps(props) {
    this.reRender(props);
  }

  componentWillUnmount() {
    try {
      elementResizeEvent.unbind(this.refs.dom);
    } catch (e) {
      console.log(e);
    }
    this.echartInstance.dispose(this.refs.dom);
  }

  reRender(props) {
    const { name, min, max, splitNumber, showValue, data } = props || this.props;
    const options = {
      series: [
        {
          name,
          type: 'gauge',
          min,
          max,
          splitNumber: splitNumber || 10,
          radius: '100%',
          title: {
            fontWeight: 'bolder',
            fontSize: 20
          },
          detail: {
            formatter: value => (isFunction(showValue) ? showValue(value) : value),
            fontWeight: 'bolder'
          },
          data: [{ value: data, name }]
        }
      ]
    };

    this.echartInstance.setOption(options);
  }

  render() {
    const { style, className } = this.props;
    const newStyle = {
      minHeight: '300px',
      ...style
    };
    return <div ref={'dom'} className={className} style={newStyle} />;
  }
}

Gauge.defaultProps = {
  name: '',
  min: 0,
  max: 100,
  data: 1,
  showValue: value => value
};
