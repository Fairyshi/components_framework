import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Input } from 'antd';
import { isFunction } from './util';

const { Search } = Input;

export default class InputFilter extends PureComponent {
  static propTypes = {
    config: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      // dispacth 的effect的指定名称空间
      namespace: PropTypes.string.isRequired,
      // dispatch指定namespace中的指定effect名称
      effect: PropTypes.string.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      keyword: props.keyword || undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.keyword !== this.state.keyword) {
      this.setState({ keyword });
    }
  }

  onChange = e => {
    this.setState({ keyword: e.target.value });
  };

  onBlur = (value) => {
    const { config = {} } = this.props;
    const { dispatch, namespace, effect } = config;

    if (isFunction(dispatch)) {
      dispatch({
        type: `${namespace}/${effect}`,
        payload: {
          keyword: value
        }
      });
    }
  };

  render() {
    const { config, ...others } = this.props;
    const { keyword } = this.state;

    return (
      <Search
        value={keyword}
        {...others}
        onChange={this.onChange}
        onBlur={this.onBlur}
      />
    );
  }
}
