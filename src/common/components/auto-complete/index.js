import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator';
import cx from 'classnames';

class DropItem extends Component {

  @autobind
  onSelected() {
    if (typeof this.props.onSelected === 'function') {
      this.props.onSelected(this.props.data);
    }
  }

  getText() {
    return this.props.data[this.props.textField];
  }

  render() {
    const cls = cx('item', { active: this.props.active });
    return (
      <div onClick={this.onSelected} className={cls} >{this.getText()}</div>
    );
  }
}

export default class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movingIndex: -1,
      defaultText: '',
      selectedItem: null,
      list: [],
      hide: true,
      loading: false
    };
  }

  componentWillMount() {
    if (this.props.selectedItem) {
      this.setState({
        defaultText: this.props.selectedItem[this.props.defaultTextField || this.props.textField],
        selectedItem: this.props.selectedItem,
        hide: true
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedItem) {
      this.setState({
        defaultText: nextProps.selectedItem[this.props.defaultTextField || this.props.textField],
        selectedItem: nextProps.selectedItem,
        hide: true
      });
    }
  }

  componentDidUpdate() {
    this.bindHideHanlder();

    const node = this.refs.container;
    const len = node.children.length;
    let height = 0;
    let bottomHeight = 0;
    for (let i = 0; i < len; i++) {
      if (i === this.state.movingIndex) {
        bottomHeight = height + node.children[i].offsetHeight;
        break;
      }
      height += node.children[i].offsetHeight;
    }
    if (node.scrollTop + node.clientHeight < bottomHeight) {
      node.scrollTop = bottomHeight - node.clientHeight;
    }
    if (height < node.scrollTop) {
      node.scrollTop = height;
    }
  }

  @autobind
  onInputChange(evt) {
    // 为空时不发请求，清空当前选中
    const iptValue = evt.target.value;
    if (!iptValue) {
      this.setState({
        defaultText: '',
        selectedItem: null,
        hide: true
      }, () => {
        if (typeof this.props.onChangeInput === 'function') {
          this.props.onChangeInput(iptValue);
        }
      });
      return;
    }

    // 有值时查询并显示下拉列表
    this.setState({
      defaultText: iptValue
    }, () => {
      if (typeof this.props.onChangeInput === 'function') {
        this.props.onChangeInput(iptValue);
      }
      if (typeof this.props.onSelected === 'function') {
        this.setState({ loading: true });
        this.props.getListData((data) => {
          this.setListData(data);
          this.setState({ loading: false });
        }, iptValue);
      }
    });
  }

  @autobind
  onKeyDown(e) {
    if (e.which === 40) {
      // down
      if (this.state.movingIndex === this.state.list.length - 1) {
        return;
      }
      this.setState({
        movingIndex: this.state.movingIndex + 1
      });
    } else if (e.which === 38) {
      // up
      if (this.state.movingIndex === 0) {
        return;
      }
      this.setState({
        movingIndex: this.state.movingIndex - 1
      });
    } else if (e.which === 13 || e.which === 32) {
      // enter
      e.preventDefault();
      e.stopPropagation();

      const data = this.state.list[this.state.movingIndex];
      if (typeof this.props.onSelected === 'function') {
        this.props.onSelected(data);
      }
    } else {
      this.setState({
        movingIndex: -1
      });
    }
  }

  onDocumentClick(e) {
    const dom = ReactDOM.findDOMNode(this);
    if (dom.contains(e.target)) {
      return;
    }
    this.setState({ hide: true });
  }

  getItemList() {
    const list = this.state.list;
    if (!list || list.length === 0) return null;

    return list.map((item, index) => {
      const active = index === this.state.movingIndex;
      return (
        <DropItem
          key={index}
          textField={this.props.textField}
          data={item}
          active={active}
          onSelected={this.setCode}
        />
      );
    });
  }

  getSelected() {
    return this.state.selectedItem;
  }

  getValue() {
    if (this.state.selectedItem === null || this.state.selectedItem === undefined) {
      return null;
    }
    return this.state.selectedItem[this.props.valueField];
  }

  getDefaultText() {
    if (this.state.selectedItem === null || this.state.selectedItem === undefined) {
      return null;
    }
    return this.state.selectedItem[this.props.defaultTextField];
  }

  getText() {
    if (this.state.selectedItem === null || this.state.selectedItem === undefined) {
      return null;
    }
    return this.state.selectedItem[this.props.textField];
  }

  @autobind
  setCode(data) {
    this.setState({
      defaultText: data[this.props.defaultTextField || this.props.textField],
      selectedItem: data,
      hide: true
    });

    if (typeof this.props.onSelected === 'function') {
      this.props.onSelected(data);
    }
  }

  setListData(data) {
    this.setState({
      list: data,
      hide: false
    });
  }

  bindHideHanlder() {
    if (this.state.hide) {
      document.removeEventListener('click', this.onDocumentClickBind);
    } else {
      this.onDocumentClickBind = this.onDocumentClick.bind(this);
      document.addEventListener('click', this.onDocumentClickBind);
    }
  }

  render() {
    const { style, className } = this.props;
    const list = this.getItemList();
    const show = !(this.state.hide || !this.state.list || this.state.list.length === 0);
    const clazz = cx('ui fluid search selection dropdown', { 'active visible': show, loading: this.state.loading }, className);
    const menuClassName = cx('menu transition', { visible: show, hidden: !show });
    return (
      <div className={clazz} style={Object.assign({ width: '15em' }, style)}>
        <i className="search icon" />
        <input className="search" style={{ cursor: 'text' }} autoComplete="off" value={this.state.defaultText} onKeyDown={this.onKeyDown} onChange={this.onInputChange} />
        <div className={menuClassName} ref="container">
          {list}
        </div>
      </div>
    );
  }
}

AutoComplete.defaultProps = {
  valueField: 'value',
  textField: 'text'
};
