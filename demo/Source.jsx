import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
