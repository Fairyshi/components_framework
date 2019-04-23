import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { isFunction, toArr } from '../util';

/**
 * @component 
 * @case1
 *   <SelectedConsumer>
 *     <Button onClick={submitAll}>全部提交</Button>
 *   </SelectedConsumer>
 * @case2
 *   <SelectedConsumer emptyContent>
 *     <Button onClick={submitAll}>不能提交哦</Button>
 *   </SelectedConsumer>
 */
export default class SelectedConsumer extends PureComponent {
  static propTypes = {
    emptyContent: PropTypes.node,
    store: PropTypes.shape({
      keyField: PropTypes.string,
      emitter: PropTypes.object.isRequired,
      cache: PropTypes.object,
      value: PropTypes.array,
      data: PropTypes.array,
    }),
  };
  
  static defaultProps = {
    emptyContent: undefined,
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
      index: 0,
    };

    this.getOnlyChild(props);
  }
  
  componentDidMount() {
    const { store } = this.props;
    const self = this;

    if (store) {
      this.unsubscribe = store.subscribe(() => {
        self.setState(state => ({ index: state.index + 1 }));
      });      
    }

    this.selectCallback = this.child.props.onClick;
  }

  componentWillReceiveProps(nextProps) {
    this.getOnlyChild(nextProps);   
    this.selectCallback = this.child.props.onClick;  
  }
  
  componentWillReceiveProps() {
    const { store } = this.props;
    const self = this;

    if (store) {
      store.subscribe(() => {
        self.setState(state => ({ index: state.index + 1 }));

        if (this.selectCallback) {
            this.selectCallback();
          }
      });
    }
  }
  
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }   
  }

  getOnlyChild = (props) => {
    const { children } = props;

    this.child = toArr(children).filter(React.isValidElement)[0];

    return this.child;
  }

  onChange = () => {
    const { store } = this.props;
    if (
      store 
        && isFunction(this.selectCallback)
    ) {
      const value = store.get();
      const event = store.getMetaInfo();

      this.selectCallback(value, event);
    } 
  }

  renderEmpty = (child) => {
    const { emptyContent } = this.props;

    if (React.isValidElement(emptyContent)) {
      return emptyContent;
    } else if (child) {
      return React.cloneElement(
        child, 
        { 
          disabled: true, /*antd 通用只读属性*/
          readOnly: true, /*常用的用户自定义只读属性*/
        }
      );
    }

    return null;
  }
  
  render() {
    const { store } = this.props;

    const isAnySelected = store.isAnySelected();

    if (!isAnySelected) {
      return this.renderEmpty(this.child);
    }

    if (!this.child) return null;

    return React.cloneElement(
      this.child, 
      { onClick: this.onChange }
    );
  }
}
