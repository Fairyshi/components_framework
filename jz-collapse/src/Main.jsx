import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Icon } from 'antd';

import FlexJustify from './FlexJustify';

import styles from 'antd/es/style/index.css';

/**
 * @component 收起|展开 控制器
 */
export default class Collapse extends PureComponent {
  static propTypes = {
    status: PropTypes.string,
    // 展开时显示的项在children的位置
    openKeys: PropTypes.oneOf(PropTypes.number, PropTypes.arrayOf(PropTypes.number)),
    prefix: PropTypes.oneOf(PropTypes.node, PropTypes.arrayOf(PropTypes.node)),
    suffix: PropTypes.oneOf(PropTypes.node, PropTypes.arrayOf(PropTypes.node)),
    // 触发键-展开节点自定义渲染
    openIcon: PropTypes.node,
    // 触发键-收起节点自定义渲染
    closeIcon: PropTypes.node,
  };

  static COLLAPSE_STATUS = {
    OPEN: '收起',
    CLOSE: '高级筛选',
  };

  constructor(props) {
    super(props);

    if (
      'status' in props && 
        Object
          .keys(Collapse.COLLAPSE_STATUS)
          .includes(props.status)
    ) {
      this.state = { status: props.status };
    } else {
      this.state = { status: Collapse.COLLAPSE_STATUS.CLOSE };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.status in Collapse.COLLAPSE_STATUS 
        && nextProps.status !== this.state.status
    ) {
      this.setState({ status: nextProps.status });
    }
  }

  toggleCollapse = () => {
    const { status } = this.state;

    this.setState({
      status:
        status === Collapse.COLLAPSE_STATUS.OPEN
          ? Collapse.COLLAPSE_STATUS.CLOSE
          : Collapse.COLLAPSE_STATUS.OPEN,
    });
  };

  getAvailableItems = () => {
    const { children, openKeys } = this.props;
    const { status } = this.state;
    const closeKeys = toArr(children).map((child, index) => index);
    const tgtKeys = status === Collapse.COLLAPSE_STATUS.CLOSE 
      ? toArr(openKeys) 
      : closeKeys;

    const items = [];

    React.Children.forEach(children, (child, index) => {
      if (React.isValidElement(child) && tgtKeys.includes(index)) {
        items.push(child);
      }
    });

    return items;
  };

  renderTigger() {
    const { trigger, openIcon, closeIcon } = this.props;
    const { status } = this.state;

    const jsxTrigger =
      trigger ||
      // 默认
      (status === Collapse.COLLAPSE_STATUS.OPEN
        ? openIcon || (
        <a role="button">
              {Collapse.COLLAPSE_STATUS.OPEN} <Icon type="up" />
        </a>
          )
        : closeIcon || (
        <a role="button">
              {Collapse.COLLAPSE_STATUS.CLOSE} <Icon type="down" />
        </a>
          ));

    return jsxTrigger;
  }

  render() {
    const { className, prefix, suffix } = this.props;
    const { status } = this.state;

    const clx = classNames(className, styles.collapsew, {
      [styles.collapsewopen]: status === Collapse.COLLAPSE_STATUS.OPEN,
    });

    const jsxAvailableItems = this.getAvailableItems();

    const jsxTrigger = this.renderTigger();

    const jsxContent = [
      ...jsxAvailableItems,
      <div className={styles.cascaderttriggerw}>
        {React.isValidElement(prefix) && prefix}
        <span className={styles.cascadertrigger} onClick={this.toggleCollapse}>
          {jsxTrigger}
        </span>
        {React.isValidElement(suffix) && suffix}
      </div>,
    ];

    return (
      <div className={clx}>
        <FlexJustify>{jsxContent}</FlexJustify>
      </div>
    );
  }
}

// 格式化为数组
function toArr(data) {
  return Array.isArray(data) 
    ? data 
    : [ data ];
}
