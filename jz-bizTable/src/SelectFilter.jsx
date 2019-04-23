import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { 
  isFunction,
  formatList4Select,
  getSelectProps,
} from './util';

const { Option } = Select;

export default class SelectFilter extends PureComponent {
  static propTypes = {
    config: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      // dispacth 的effect的指定名称空间
      namespace: PropTypes.string.isRequired,
      // dispatch指定namespace中的指定effect名称
      effect: PropTypes.string.isRequired,
      // Option 中的每个选项数据
      data: PropTypes.array,
      // 过滤器名（对应store中state中fromData中指定的过滤器名称）
      filter: PropTypes.string.isRequired,
      // antd select options lable从data的每个item取值的key
      labelField: PropTypes.string,
      // antd select options value从data的每个item取值的key
      valueField: PropTypes.string,
    }),
  };

  static defaultProps = {
    config: {
      data: [],
      labelField: 'name',
      valueField: 'id',
    }
  };

  componentDidMount() {
    const { config = {} } = this.props;
    const { dispatch, namespace, effect } = config;

    // 初始化请求列表数据
    if (isFunction(dispatch)) {
      dispatch({
        type: `${namespace}/${effect}`
      });
    }
  }

  onChange = (value) => {
    const { config = {} } = this.props;
    const { dispatch, namespace, effect, filter } = config;

    if (isFunction(dispatch)) {
      dispatch({
        type: `${namespace}/${effect}`,
        payload: {
          [filter]: value
        }
      });
    }
  }

  render() {
    const { config = {}, ...others } = this.props;
    const { data, labelField, valueField } = config;
    const selectData = formatList4Select(data, labelField, valueField);
    const props = getSelectProps({...others});

    return (
      <Select {...props} onChange={this.onChange}>{ 
        selectData.map((item, index) => (
          <Option key={index} value={item.value}>
            {item.label}
          </Option>
        ))
      }</Select>
    );
  }
}
