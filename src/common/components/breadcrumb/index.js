import React, { Component } from 'react';
import cx from 'classnames';

class Breadcrumb extends Component {

  constructor(props) {
    super(props);
    this.state = { };
  }


  render() {
    const { links } = this.props;
    const linkElements = [];
    links.forEach((item, index) => {
      const { text, href, active } = item;
      const clz = cx('section', { active });
      if (index === links.length - 1) {
        linkElements.push(<div key={`link${index + 1}`} className={clz} href={href}>{text}</div>);
      } else {
        linkElements.push(<a key={`link${index + 1}`} className={clz} href={href}>{text}</a>);
      }
      if (index < links.length - 1) {
        linkElements.push(<div key={`spliter${index + 1}`} className="divider"> / </div>);
      }
    });
    if (this.props.header) {
      return (
        <h3 className="ui dividing header">
          <div className="ui breadcrumb">
            {linkElements}
          </div>
        </h3>
      );
    }
    return (
      <div className="ui breadcrumb">
        {linkElements}
      </div>
    );
  }

}

Breadcrumb.defaultProps = {
  header: true
};

export default Breadcrumb;
