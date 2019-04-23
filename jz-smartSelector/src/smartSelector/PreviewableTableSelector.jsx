import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Table } from 'antd';

import PreviewList from './PreviewList';
import TriggerAll from './TriggerAll';
import { toArr, isFunction, isContentEqual } from '../util';

import styles from '@alipay/jz-SmartSelector/assets/index.less';

/**
 * @component {ui} 
 * @param {*} param0 
 */
export default class PreviewableTableSelector extends PureComponent {
  static propTypes = {
    previewable: PropTypes.bool,
    store: PropTypes.shape({
      keyField: PropTypes.string,
      emitter: PropTypes.object.isRequired,
      cache: PropTypes.object,
      value: PropTypes.array,
      data: PropTypes.array,
    }),
  };

  static defaultProps = {
    previewable: false,
    store: {
      keyField: 'fid',
      emitter: null,
      cache: {},
      value: [],
      data: [],
    },
  };
  
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || [],
      dataSource: props.dataSource || [],
    };
    if (props.store) {
      this.updateStore(
        props.store, 
        props.value, 
        props.dataSource,
      );
    }
    this.tableKey = 0;
  }

  componentDidMount() {
    const { store, value, dataSource, onChange } = this.props;
    const self = this;

    if (store) {
      this.unsubscribe = store.subscribe((event = {}) => {
        const { value, data: dataSource } = event;
        self.setState({ value, dataSource });
        self.tableKey = self.tableKey + 1;

        if (
          !isContentEqual(value, this.state.value) 
            && isFunction(onChange)
        ) {
          const event = store.getMetaInfo();
          
          onChange(event);
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('dataSource' in nextProps) {
      this.updateStore(
        nextProps.store || this.props.store, 
        nextProps.value, 
        nextProps.dataSource
      );
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      this.tableKey = 0;
    } 
  }

  updateStore = (store, value = [], data = []) => {
    if (store) {
      store.set(value, data);
    }
  }

  render() {
    const { 
      previewable, 
      store, 
      value: value_, 
      dataSource: dataSource_, 
      ...others  
    } = this.props;
    let rowSelection = this.props.rowSelection;
    const { value, dataSource/* , rowSelection */  } = this.state;

    if (
      !store 
        || rowSelection === false
    ) {
      return (<Table {...this.props} />);
    }

    if (typeof rowSelection !== 'object') {
      rowSelection = {};
    }

    const jsx = [];
    // const { value, data, isAllSelected, isAnySelected } = store.getMetaInfo();
    if (previewable) {
      jsx.push(<PreviewList store={store} readOnly/>);
    }

    const propsTable = {
      ...others,
      selectedRowKeys: [...value],
      dataSource,
      rowSelection: {
        ...rowSelection,
        fixed: true,
        columnTitle: (
          <TriggerAll
            store={store}
            onText={null}
            offText={null} 
          />
        ),
        getCheckboxProps: record => {
          const givenProps = isFunction(rowSelection.getCheckboxProps) 
            ? rowSelection.getCheckboxProps(record)
            : {};
          const checked = toArr(value)
            .includes(record[store.keyField]);
    /* console.log('-------getCheckboxProps--------');
    console.log({
      ...givenProps,
      checked,
    }); */
          return {
            columnWidth: 54,
            ...givenProps,
            checked,
          };
        },
        onSelectAll: (value, selectedRows) => {
          store.set(value, selectedRows);
        },
        onSelect: (record, selected, selectedRows, nativeEvent) => {
          store.toggle(record, selectedRows);
        },
      }
    };
    const jsxTable = (<Table rowKey="key" {...propsTable} key={this.tableKey} />);

    jsx.push(jsxTable);

    return jsx;
  }
}
