import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Trigger from './Trigger';
import Wrapper from './Wrapper';

// 收起状态 or 打开状态
const STATUS= {
  CLOSE: 'close',
  OPEN: 'open',
};
export default class PreviewController extends PureComponent {
  static propTypes = {
    status: PropTypes.string,
    // trigger中的内容
    trigger: PropTypes.any,
    // 预览展开时，JSON编辑区顶部的组件
    header: PropTypes.any,
    // 收起模式下，点击trigger
    onOpen: PropTypes.func,
    // 打开模式下，点击关闭or收起
    onClose: PropTypes.func,
    // 是否能预览
    previewable: PropTypes.bool,
    // 是否显示右下角的全局预览触发器
    hasGlobalTrigger: PropTypes.bool,
  };

  static defaultProps = {
    status: STATUS.CLOSE,
    previewable: true,
    hasGlobalTrigger: true,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { status, trigger, header, children, previewable, hasGlobalTrigger, onOpen, onClose } = this.props;
    const clx = classNames('preview-controller', status);

    let jsxGlobalTrigger = null;
    if (hasGlobalTrigger) {
      const propsTrigger = {
        previewable,
        visible: status === STATUS.CLOSE,
        onOpen,
      };
      jsxGlobalTrigger = <Trigger {...propsTrigger}>{trigger}</Trigger>;
    }

    const propsWrapper = {
      visible: status === STATUS.OPEN,
      header,
      onClose,
    };

    return (
      <div className={clx}>
        {jsxGlobalTrigger}
        <Wrapper {...propsWrapper} >{children}</Wrapper>
      </div>
    );
  }
}
