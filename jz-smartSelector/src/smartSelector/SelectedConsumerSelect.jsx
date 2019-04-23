import PropTypes from 'prop-types';
import React, { PureComponent, cloneElement } from 'react';
import { Select } from 'antd';

import { isEmptyArray, isFunction, toArr } from '../util';

import SelectedConsumer from './SelectedConsumer';

const Option = Select.Option;

/**
 * @component Antd Select样式的批量设置SelectedConsumer(后者只能有一个child)
 * @case1
 *   <SelectedConsumerSelect 
 *     store={store} 
 *     data={[
 *       {label: '批量启用', value: 'enable'},
 *       {label: '批量编辑', value: 'edit'},
 *       {label: '批量删除', value: 'delete'},
 *     ]}
 *   />
 */
export default class SelectedConsumerSelect extends PureComponent {
  static propTypes = {
    store: PropTypes.shape({
      keyField: PropTypes.string,
      emitter: PropTypes.object.isRequired,
      cache: PropTypes.object,
      value: PropTypes.array,
      data: PropTypes.array,
    }),
    data: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string
      })
    ),
    placeholder: PropTypes.string,
  };
  
  static defaultProps = {
    store: {
      keyField: 'fid',
      emitter: null,
      cache: {},
      value: [],
      data: [],
    },
    data: [],
    placeholder: '批量操作'
  };

  constructor(props) {
    super(props);

    this.state = {
      selectKey: 0
    };
    if (props.store) {
      this.watchStore(props.store);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      'store' in nextProps 
        && nextProps.store !== this.store
    ) {
      this.watchStore(nextProps.store);

      this.setState(state => {
        return {
          selectKey: Number(state.selectKey)
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      this.selectKey = 0;
    } 
  }

  watchStore = (store) => {
    const self = this;

    if (store) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }

      this.unsubscribe = store.subscribe((event = {}) => {
        const selectKey = Number(self.state.selectKey) + 1;
        self.setState({
          selectKey
        });
      });
    }
  }

  onBatch = (operType) => {
    const { onSelect, store } = this.props;
    if (store && isFunction(onSelect)) {
      const value = store.get();
      onSelect(operType, value, {
        target: operType,
        value
      });
    } 
  }
  
  render() {
    const { placeholder, data: data_, onSelect, ...others } = this.props;
    const data = data_ 
      ? toArr(data_) 
      : [];
    const disabled = isDisabled(this.props);

    return (
      <Select
        key={this.state.selectKey}
        value={undefined}
        disabled={disabled}
        placeholder={placeholder}
        style={{ width: 120 }} 
        onSelect={this.onBatch}
        className={{ isanyselected: !disabled }}
      >{
        data.map(
          (item, index) => {
            const operType = getConsumerId(item, index);
            return (
              <Option value={operType} key={operType}>
                {item.label}
              </Option>
            );
          }
        )
        .filter(Boolean)
      }
      </Select>
    );
  }
}

function getConsumerId(item, index) {
  if (!item) return index;

  return item.value
    || item.id
    || item.type
    || index;
}

// 是否是禁用状态
function isDisabled(props) {
  if (props && props.store) {
    if (isEmptyArray(props.data)) {
      return true;
    }

    const isAnySelected = props.store.isAnySelected();
    return !isAnySelected;
  }
  return true;
}
