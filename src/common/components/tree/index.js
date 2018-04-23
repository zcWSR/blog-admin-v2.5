import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import cn from 'classnames';

import './tree.less';

export class TreeNode extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      loaded: false,
      loading: false,
      childNode: [],
      childNodesHeight: 0
    };
  }

  @autobind
  setData(childData) {
    this.setState({
      loaded: true,
      loading: false,
      childNode: childData
    }, () => {
      this.unfold();
    });
  }

  @autobind
  loadChild() {
    this.setState({ loading: true });
    const { onLoadChild } = this.context;
    const { data } = this.props;
    onLoadChild(data, childData => this.setData(childData));
  }

  @autobind
  toggleChild() {
    const { loaded, show } = this.state;
    if (loaded) {
      if (show) {
        this.flod();
      } else {
        this.unfold();
      }
    } else {
      this.loadChild();
    }
  }
  // auto => [height] => 0
  flod() {
    this.setState({
      childNodesHeight: `${this.refs.childNodes.scrollHeight}px`,
      show: false
    }, () => {
      setTimeout(() => {
        this.setState({ childNodesHeight: 0 });
      }, 0); // 不加定时器height会直接从auto变成0, 动画没了, 不知道为啥
    });
  }

  // 0 => [height] => auto
  unfold() {
    this.setState({
      childNodesHeight: `${this.refs.childNodes.scrollHeight}px`,
      show: true
    }, () => {
      setTimeout(() => this.setState({ childNodesHeight: 'auto' }), 300);
    });
  }

  renderInfo() {
    const { columnRenderer, nameMap, columns } = this.context;
    const { data } = this.props;
    const { loading, show } = this.state;
    const iconClz = cn('icon caret right', { show });

    let nodeName = data[nameMap.key];
    if (isFunction(nameMap.render)) {
      nodeName = nameMap.render(nodeName, data);
    }

    return (
      <div className="node-info" ref={'nodeInfo'} onClick={this.toggleChild}>
        <div className="info">
          <i className="icon tasks" />
          <span className="name">{nodeName}</span>
          <i className={iconClz} />
          {loading && <i className="ui tiny active inline loader" />}
        </div>
        <div className="other-infos">
          {
            columns.map((column, index) => {
              const renderer = columnRenderer[column.key];
              let columnName = data[column.key];
              if (isFunction(renderer)) {
                columnName = renderer(columnName, data);
              }
              return (
                <span
                  key={`otherinfo_${index}`}
                  className="info"
                  style={{ width: `${column.width}px` }}
                >{columnName}</span>
              );
            })
          }
        </div>
      </div>
    );
  }

  renderChildNode() {
    const nodes = this.state.childNode.map((item, index) => {
      const props = {
        ...this.props,
        key: `node_${index}`,
        data: item
      };
      return (<TreeNode {...props} />);
    });

    return (<div className="child-nodes" ref={'childNodes'}>{nodes}</div>);
  }

  render() {
    const { childNodesHeight } = this.state;
    return (
      <div className="tree-node">
        {this.renderInfo()}
        <div className="child-container" style={{ height: childNodesHeight }}>
          {this.renderChildNode()}
        </div>
      </div>
    );
  }
}

// TreeNode.defaultProps = {
//   info: {
//     name: 'child_node',
//     runDate: moment().format('YYYY-MM-DD'),
//     taskAuthor: 'congzz.zhao',
//     starTime: moment().format('YYYY-MM-DD HH:mm:ss'),
//     endTime: moment().format('YYYY-MM-DD HH:mm:ss')
//   },
//   level: 0
// };


export default class Tree extends Component {
  constructor(props) {
    super();
    this.columnRenderer = this.reduceColumnsForChild(props);
    this.state = {
      loading: false,
      childData: []
    };
  }

  getChildContext() {
    const { name, columns, onLoadChild } = this.props;
    return {
      nameMap: name,
      columns,
      columnRenderer: this.columnRenderer,
      onLoadChild
    };
  }

  componentDidMount() {
    this.loadChild();
  }

  setData(childData) {
    this.setState({
      childData, loading: false
    });
  }

  @autobind
  loadChild() {
    this.setState({ loading: true });
    this.props.onLoadChild(null, childData => this.setData(childData));
  }

  reduceColumnsForChild(props) {
    const { columns } = props;
    return columns.reduce((prev, curr) => {
      const { key, render } = curr;
      prev[key] = isFunction(render) ? render : null;
      return prev;
    }, {});
  }

  renderHeader() {
    const { name, columns } = this.props;
    const otherHeaders = columns.map((item, index) => {
      const { text, width } = item;
      return (
        <div
          key={`otherItem_${index}`}
          className="item"
          style={{ width: `${width}px` }}
        >{text}</div>
      );
    });
    return (
      <div className="tree-header">
        <div className="item">{name.text}</div>
        <div className="items">
          {otherHeaders}
        </div>
      </div>
    );
  }

  renderTree() {
    const { childData } = this.state;
    const { name, columns, dark, onLoadChild } = this.props;
    return childData.map((item, index) => (
      <TreeNode
        key={`node_${index}`}
        nameMap={name}
        columns={columns}
        columnRenderer={this.columnRenderer}
        dark={dark}
        onLoadChild={() => onLoadChild()}
        data={item}
      />
    ));
  }

  render() {
    const { dark } = this.props;
    const clz = cn('tree', { dark });
    return (
      <div className={clz}>
        {this.renderHeader()}
        {this.renderTree()}
        {
          this.state.loading && (
            <div className="ui active loader" />
          )
        }
      </div>
    );
  }
}

// Tree.defaultProps = {
//   name: { key: 'name', text: '名称', render: null },
//   columns: [
//     {
//       key: 'runDate',
//       text: '运行时间',
//       width: 120
//     },
//     {
//       key: 'taskAuthor',
//       text: '任务作者',
//       width: 120
//     },
//     {
//       key: 'starTime',
//       text: '开始时间',
//       render: (value, item) => moment(item.starTime).format('YYYY年MM月DD日 HH:mm:ss'),
//       width: 210
//     },
//     {
//       key: 'endTime',
//       text: '结束时间',
//       render: (value, item) => moment(item.starTime).format('YYYY年MM月DD日 HH:mm:ss'),
//       width: 210
//     }
//   ],
//   dark: false,
//   onLoadChild: (item, setData) => {
//     mockFetch(item).then(data => setData(data));
//   },
// };

TreeNode.contextTypes = {
  nameMap: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.object),
  columnRenderer: PropTypes.object,
  onLoadChild: PropTypes.func
};

Tree.childContextTypes = {
  nameMap: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.object),
  columnRenderer: PropTypes.object,
  onLoadChild: PropTypes.func
};
