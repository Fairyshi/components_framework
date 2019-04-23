/*
 * @Author: 嘉竹 (shifei.sf)
 */
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Popover, Icon } from 'antd';
import { flatComplicatedErrors, filter4ErrorItems, isNoparse } from '../../util';

import ErrorList from './List';
import cssStyles from './index.less';

/**
 * @component 校验结果信息汇总展示，支持点击清除
 */
export default class ErrorContainerComp extends PureComponent {
  static propTypes = {
    errors: PropTypes.object,
    // 显示出错误在表单中的具体位置
    showErrorKey: PropTypes.bool,
    onDelete: PropTypes.func,
    styles: PropTypes.object,
    UiTrigger: PropTypes.node,
    UiList: PropTypes.node,
    UiItem: PropTypes.node,
  };

  static defaultProps = {
    errors: {},
    showErrorKey: false,
    styles: {},
    onDelete: _.noop,
    UiTrigger: null,
    UiList: null,
    UiItem: null,
  };

  refNode = null;

  getPopupContainer = () => (this.refNode ? findDOMNode(this.refNode) : null);

  // 全局错误信息查看的 触发入口
  renderPopTrgger(errKeys = []) {
    const { UiTrigger } = this.props;
    const clx = classNames(cssStyles.errorContainer, cssStyles.errorContainer1);
    const props = {
      className: clx,
      style: { zIndex: 1001 },
      ref: refNode => {
        this.refNode = refNode;
      },
    };

    return UiTrigger ? (
      <div {...props}>{UiTrigger}</div>
    ) : (
      <div {...props}>
        <Icon type="close-circle" />
        校验错误 {_.size(errKeys)} 个，点击查看错误详情
      </div>
    );
  }

  renderPopContent(filteredError, errKeys) {
    const { showErrorKey = false, onDelete, styles = {}, UiList, UiItem, mode, lg } = this.props;

    return (
      <ErrorList
        styles={styles}
        errors={filteredError}
        errKeys={errKeys}
        showErrorKey={showErrorKey}
        onDelete={onDelete}
        UiList={UiList}
        UiItem={UiItem}
        mode={mode}
        lg={lg}
      />
    );
  }

  render() {
    const { errors, mode } = this.props;

    if (_.isEmpty(errors)) return null;

    const filteredError = isNoparse(mode) /* 直接展示 */
      ? errors
      : filter4ErrorItems(flatComplicatedErrors(errors));

    // 过滤无效的空值
    const errKeys = Object.keys(filteredError).filter(key => filteredError[key]);

    if (
      _.isEmpty(errKeys) ||
      (isNoparse(mode) && _.every(_.values(errors), val => val === undefined || val == null))
    )
      return null;

    return (
      <span className={cssStyles.errorIcon}>
        <Popover
          title={<div className={cssStyles.errorTitle}>表单校验错误</div>}
          placement="bottom"
          content={this.renderPopContent(filteredError, errKeys)}
          overlayClassName={cssStyles.errorPopover}
          getPopupContainer={this.getPopupContainer.bind(this)}
        >
          {this.renderPopTrgger(errKeys)}
        </Popover>
      </span>
    );
  }
}
