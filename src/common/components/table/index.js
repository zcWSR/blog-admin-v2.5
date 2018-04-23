/* eslint-disable */
import React, { Component } from 'react';
import cn from 'classnames';

/**
 * 和ant.design的Table 组件类似, 简单封装
 * Usage:

const data = [
  { id: 1, name: '呵呵' }
  { id: 2, name: '哈哈' }
];

const columns = [
  { title: '操作', width: 100, render: () => <Button>删除</Button> },
  { dataIndex: 'id', title: 'ID', rebder: (text, record, index) => null },
  { dataIndex: 'name', title: '图表组名称' }
];

<Table dataSource={data} columns={columns} />

 */

export default class Table extends Component {

  static propTypes = {
    dataSource: React.PropTypes.array,
    columns: React.PropTypes.array
  }

  static defaultProps = {
    dataSource: [],
    columns: [],
    noData: '暂无数据'
  }

  /**
   * 处理数据
   * 转换成[[12,23,43], [12, 43, 543]] 的形式
   * @return {[Array]}
   */
  _processData() {
    const { dataSource, columns } = this.props;
    const records = [];

    dataSource.forEach((item, index) => {
      const record = [];
      columns.forEach((col) => {
        let val = item[col.dataIndex];
        if (typeof col.render === 'function') {
          val = col.render(val, item, index);
        }
        record.push(val);
      });
      records.push(record);
    });

    return records;
  }

  /**
   * 渲染表格行
   * @return {[type]} [description]
   */
  rendertbody() {
    const { columns, noData } = this.props;
    const records = this._processData();
    const rows = [];
    const columnsLen = columns.length;
    const len = records.length;

    records.forEach((item, index) => {
      const tds = [];
      item.forEach((val, idx) => {
        tds.push(
          <td key={index + ',' + idx}>
            {val}
          </td>);
      });
      rows.push(
        <tr key={index}>{tds}</tr>
      );
    });

    // 处理无数据情况
    if (len === 0) {
      const noDataRow = (
        <tr key="~nodata~"><td className="center aligned" colSpan={columnsLen}>{noData}</td></tr>
      );
      rows.push(noDataRow);
    }

    return (<tbody>{rows}</tbody>);
  }

  /**
   * 渲染表头
   * @return {[type]} [description]
   */
  renderHead() {
    const { columns } = this.props;
    const ths = columns.map((col, index) => {
      return <th key={index}>{col.title || col.dataIndex}</th>;
    });
    return <thead><tr>{ths}</tr></thead>;
  }

  /**
   * 单元格长度
   * @return {[type]} [description]
   */
  renderWidth() {
    const { columns } = this.props;
    const cols = columns.map(col => {
      return <col style={{ width: col.width }} key={col.title} />;
    });
    return <colgroup>{cols}</colgroup>;
  }

  render() {
    const tableClz = cn('ui table', this.props.tableType || 'celled');
    return (
      <table className={tableClz}>
        {this.renderHead()}
        {this.renderWidth()}
        {this.rendertbody()}
      </table>
    );
  }
}
