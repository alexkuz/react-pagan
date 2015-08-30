import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Highlight from 'react-highlight';

export default class Source extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    return (
      <Highlight className='javascript' style={{ margin: 0 }}>
        {this.props.text}
      </Highlight>
    );
  }
}
