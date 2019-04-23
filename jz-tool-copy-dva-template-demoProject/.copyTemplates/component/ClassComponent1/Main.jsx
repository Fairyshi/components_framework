import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import {  } from 'antd';
import {  } from '@/util';

import styles from './index.less';

/**
 * @component 类组件模版
 */
export default class {{ClassComponent}} extends PureComponent {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: [],
    onChange: _.noop,
  };


  constructor(props) {
    super(props);
    this.state = {
      value: props.value 
        || props.defaultProps 
        || undefined,
    };
  }

  componentWillReceiveProps(nextProps) {
    const state = {};
    if (
      'value' in nextProps 
        && nextProps.value !== this.state.value
      ) {
      state.value = nextProps.value;
    }
    if (!_.isEmpty(state)) {
      this.setState(state);
    }
  }

  onChange = (itemKey, e) => {
    const { value, onChange } = this.props;

    this.setState({ value: 'todo' });

    if (onChange && onChange !== _.noop) onChange('todo');
  };

  renderUnit() {
    const {  } = this.props;

    return (
      <div className={styles.toggleAllWrap}>
        <Empty description="todo" />
      </div>
    )
  }

  render() {
    const { value = [], children } = this.props;

    if (React.Children.count(children)) return null;

    return (
      <div className={styles.checkboxGroup}>
        <Empty />
        {this.renderUnit()}
      </div>
    );
  }
}
