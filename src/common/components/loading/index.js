import React, { Component } from 'react';
import cn from 'classnames';

export default class Loading extends Component {
  constructor(props) {
    super();
    this.content = props.content || '加载中';
    this.state = {
      animate: '',
      show: false
    };
    this.showTimeout = null;
    this.hideTimeout = null;
  }
  componentWillReceiveProps({ show }) {
    if (show) {
      this.setState({
        animate: 'fade in',
        show
      });
    } else {
      this.setState(
        {
          animate: 'fade out'
        },
        () => {
          if (this.showTimeout) clearTimeout(this.showTimeout);
          this.hideTimeout = setTimeout(() => this.setState({ show }), 500);
        }
      );
    }
  }

  render() {
    const clz = cn(
      'ui dimmer transition animating',
      { active: this.state.show },
      this.state.animate
    );
    return (
      <div className={clz} style={{ position: 'fixed' }}>
        <div className="ui text loader">{this.content}</div>
      </div>
    );
  }
}
