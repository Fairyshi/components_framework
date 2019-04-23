import PropTypes from 'prop-types';
import React, { PureComponent, cloneElement } from 'react';
import { isFunction } from './util';

export default class TriggerFilter extends PureComponent {
  static propTypes = {
    config: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      // dispacth 的effect的指定名称空间
      namespace: PropTypes.string.isRequired,
      // dispatch指定namespace中的指定effect名称
      effect: PropTypes.string,
    }),
  };

  static defaultProps = {
    // 触发请求列表数据
    effect: 'masterList',
  };

  componentDidMount() {
    const { config = {} } = this.props;
    const { dispatch, namespace, effect } = config;
    const payload = {};

    if (isFunction(dispatch)) {
      dispatch({
        type: `${namespace}/${effect}`,
        /* payload */
      });
    }
  }

  render() {
    const { config = {}, children, ...others } = this.props;
    
    return cloneElement(children, { ...others });
  }
}
