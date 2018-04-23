import React, { Component } from 'react';
import echart from 'echarts';
import elementResizeEvent from 'element-resize-event';
import { isFunction } from 'lodash';
import 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';

export default class Bar extends Component {
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

  getSeries(datas) {
    return datas.map((item) => {
      const { name, data, width } = item;
      return {
        name,
        type: 'bar',
        barWidth: width,
        barGap: 0,
        data
      };
    });
  }

  getLegend(data) {
    if (data.length > 0) {
      return {
        data: data.map(item => item.name)
      };
    }
    return null;
  }

  reRender(props) {
    const { colors, columns, columnTitle, max, min, data, dataTitle, tooltip } =
      props || this.props;
    const options = {
      grid: {
        left: '3%',
        right: '5%',
        bottom: '0%',
        // top: '10%',
        containLabel: true
      },
      color: !colors || colors.length ? ['#40a6da', '#ff4415'] : colors,
      tooltip: {
        trigger: 'axis',
        formatter:
          tooltip &&
          ((params, ticket, callback) => {
            callback(ticket, () => tooltip(params));
          }),
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: this.getLegend(data),
      xAxis: {
        name: columnTitle,
        type: 'category',
        data: columns
      },
      yAxis: {
        name: dataTitle,
        type: 'value',
        min: min && isFunction(min) ? min : null,
        max: max && isFunction(max) ? max : null
      },
      series: this.getSeries(data)
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

Bar.defualtProps = {
  colors: [],
  name: '',
  columns: [{ name: 1, data: [] }, { name: 2, data: [] }],
  // columnTitle: 'columnTitle',
  // max: ({ max }) => max + 20,
  // min: null,
  // data: [{ name: 'data1', data: [] }, { name: 'data2', data: [] }],
  data: [],
  // dataTitle: 'dataTitle',
  tooltip: null
};
