import React, { Component } from 'react';
import cn from 'classnames';
import autobind from 'autobind-decorator';

export default class DropdownMenu extends Component {
  constructor(props) {
    super();
    // const { name, menu } = this.props;
    this.state = {
      ...props,
      show: false,
      upward: false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      ...props
    });
  }

  @autobind
  toggleMenu() {
    const { thisRef } = this.refs;
    const offsetBottom = window.innerHeight - thisRef.clientHeight - thisRef.offsetTop;
    this.setState({
      show: !this.state.show,
      upward: offsetBottom < this.state.menu.length * 36
    });
  }

  renderMenu() {
    const { menu } = this.state;
    return menu.map((item, index) => {
      if (typeof item === 'string') {
        return (<div className="divider" key={`menu_${index}`} />);
      }
      const { name, description, action } = item;
      return (
        <div className="item" key={`menu_${index}`} onClick={() => { action(); }}>
          <div className="description">{description}</div>
          {name}
        </div>
      );
    });
  }

  render() {
    const { name, show, upward } = this.state;
    const dropDownClz = cn(
      'ui dropdown',
      { 'active visible': show, upward }
    );

    const menuClz = cn(
      'menu transition slide',
      { visible: show, hidden: !show }
    );
    return (
      <div className={dropDownClz} onClick={this.toggleMenu} ref={'thisRef'}>
        <div className="text">{name}</div>
        <i className="icon dropdown" />
        <div className={menuClz} ref={'menus'}>
          {this.renderMenu()}
        </div>
      </div>
    );
  }
}

DropdownMenu.defaultProps = {
  name: 'menu',
  menu: [
    // {
    //   name: 'selection1',
    //   description: 'Ctrl + c',
    //   action: () => console.log('click selection1')
    // },
    // 'divider',
    // {
    //   name: 'selection2',
    //   description: '',
    //   action: () => console.log('click selection2')
    // }
  ]
};
