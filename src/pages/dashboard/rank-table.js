import React, { Component } from 'react';

import Table from 'common/components/table';

export default class RankTable extends Component {
  constructor() {
    super();
    this.columns = [
      {
        title: '文章名',
        render: (value, item) => {
          if (!value) {
            return (<span>(文章已删除)</span>);
          }
          return (
            <a target="_blank" href={`//zcwsr.com/posts/${item.id}`}>
              {value}
            </a>
          );
        },
        dataIndex: 'title'
      },
      { title: '浏览次数', dataIndex: 'count' }
    ];
  }
  render() {
    return (
      <div className="ui segment">
        <div className="ui header">博文浏览次数排行榜</div>
        <Table dataSource={this.props.data} columns={this.columns} tableType={'very basic'} />
      </div>
    );
  }
}
