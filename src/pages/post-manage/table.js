import React, { Component } from 'react';
import moment from 'moment';
import cn from 'classnames';
// import autobind from 'autobind-decorator';

// import DropdownMenu from 'app/common/components/dropdown-menu';
import Table from 'common/components/table';

export default class PostTable extends Component {
  constructor() {
    super();
    this.columns = [
      { title: 'id', dataIndex: 'id', width: 95 },
      { title: '名称', dataIndex: 'title' },
      { title: '创建时间', dataIndex: 'createAt', render: value => moment(value).format('YYYY-MM-DD HH:mm:ss'), width: 160 },
      { title: '修改时间', dataIndex: 'updateAt', render: value => moment(value).format('YYYY-MM-DD HH:mm:ss'), width: 160 },
      { title: '类别', dataIndex: 'category', render: value => <div className="ui label blue">{value}</div>, width: 90 },
      {
        title: '标签',
        dataIndex: 'labels',
        render: val => (
          <div className='ui labels blue'>
            { val.map((label, index) => <div key={`label-${index}`} className="ui label">{label}</div>) }
          </div>
        ),
        width: 140
      },
      {
        title: '操作',
        render: (val, item) => {
          const lockClz = cn('icon', { lock: item.lock, unlock: !item.lock });
          return (
            <div>
              <button className="ui icon button" onClick={() => this.props.edit(item)}>
                <i className="icon edit" />
              </button>
              <button className="ui icon button" onClick={() => this.props.lock(item)}>
                <i className={lockClz} />
              </button>
              <button className="ui icon button" onClick={() => this.props.delete(item)}>
                <i className="icon remove" />
              </button>
            </div>
          );
        },
        width: 150
      }
    ];
    this.state = {
      data: []
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      data: props.data
    });
  }

  render() {
    return (
      <Table dataSource={this.state.data} columns={this.columns} />
    );
  }
}
