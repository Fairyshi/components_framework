import PropTypes from 'prop-types';
import React, { PureComponent, cloneElement } from 'react';

import SelectedConsumer from './SelectedConsumer';

/**
 * @component 批量设置SelectedConsumer(后者只能有一个child)
 * @case1
 *   <SelectedConsumerGroup store={store}>
 *     <Button onClick={submitAll}>全部启用</Button>
 *     <Button onClick={submitAll}>全部编辑</Button>
 *     <Button onClick={submitAll}>全部删除</Button>
 *   </SelectedConsumerGroup>
 */
export default class SelectedConsumerGroup extends PureComponent {
  static propTypes = {
    store: PropTypes.shape({
      keyField: PropTypes.string,
      emitter: PropTypes.object.isRequired,
      cache: PropTypes.object,
      value: PropTypes.array,
      data: PropTypes.array,
    }),
  };
  
  static defaultProps = {
    store: {
      keyField: 'fid',
      emitter: null,
      cache: {},
      value: [],
      data: [],
    },
  };
  
  render() {
    const { children, ...others } = this.props;

    return React.Children.map(
      children, 
      (child, index) => {
        return (
          <SelectedConsumer {...others} key={index}>
            {child}
          </SelectedConsumer>
        );
      }
    );
  }
}
