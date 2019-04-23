import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import _ from 'lodash';

import { isFunction, preventDefault } from '../util';
import { TiggerAll as TiggerAllUi } from '../ui';

/**
 * @Component 根据 store的值自动切换数据状态
 */
export default class TriggerAll extends PureComponent {
  static propTypes = {
    store: PropTypes.object,
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    store: {},
    readOnly: false,
  };

  constructor(props) {
    super(props);

    this.store = props.store || null;

    this.state = getInitalState(this.store);

    this.watchStore();
  }

  watchStore() {
    const { store } = this;
    if (
      store 
        && isFunction(store.subscribe)
    ) {
      this.unsubscribe = store.subscribe(() => {
        this.update();
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      'store' in nextProps 
        && nextProps.store !== this.store
    ) {
      this.store = nextProps.store;

      this.state = getInitalState(this.store);
      this.watchStore();
    }
  }

  componentWillUnmount() {
    if (isFunction(this.unsubscribe)) {
      this.unsubscribe();

      this.store = null;
    }
  }

  update = () => {
    const { store } = this;

    if (!store) return;

    const checked = store.isAllSelected();
    const indeterminate = !checked 
      && store.isAnySelected();

    if (
        checked !== this.state.checked 
          || indeterminate !== this.state.indeterminate
    ) {
      const state = {
        checked,
        indeterminate
      };
      
      this.setState(state);
    }
  }

  onChange = (e) => {
    preventDefault(e);

    if (
      this.store 
        && isFunction(this.store.selectAll)
    ) {
      this.store.selectAll();
    }
  }

  render() {
    const { 
      store = {}, 
      readOnly = false, 
      onText, 
      offText
    } = this.props;
    if (!store) return null;

    const { checked, indeterminate } = this.state;

    return (
      <TiggerAllUi
        readOnly={readOnly}
        checked={checked}
        indeterminate={indeterminate}
        onText={onText}
        offText={offText}
        onChange={this.onChange}
      />
    );
  }
}

// 根据store中的 data-value 状态获取 checkbox的值
function getInitalState (store) {
  if (!store || !store.getMetaInfo) {
    return {
      checked: false,
      indeterminate: false,
    };
  }

  if (isFunction(store.getMetaInfo)) {
    const { isAllSelected, isAnySelected } = store.getMetaInfo();

    return {
      checked: isAllSelected,
      indeterminate: !isAllSelected && isAnySelected
    };
  }
}
