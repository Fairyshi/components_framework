import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import {  } from '../util';
import {  } from '../ui';

/**
 * @component 
 */
export default class SmartProvider extends PureComponent {
  static propTypes = {
    store: PropTypes.shape({
    }),
  };

  static defaultProps = {
    store: {
    },
  };
  
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillReceiveProps(nextProps) {
  }


  render() {
    const {  } = this.props;
    const {  } = this.state;
    
    return (
      <div />
    );
  }
}
