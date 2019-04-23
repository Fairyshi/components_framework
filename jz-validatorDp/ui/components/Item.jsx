/*
 * @Author: 嘉竹 (shifei.sf)
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import _ from 'lodash';
import classNames from 'classnames';

import { isErrorResult, isNoparse } from '../../util';
import { scrollToField, getFieldKeyDom, parse4Help, isInDomClass } from '../../util/ui';

import styles from './index.less';

/**
 * @component 校验结果信息汇总中的单条信息
 */
const ErrorItemComp = ({ showErrorKey = false, domKey, data, onDelete, mode }) => {
  if (_.isEmpty(data) || (!isNoparse(mode) && !isErrorResult(data))) return null;

  function onClick(e) {
    const triggerByDelelte =
      isInDomClass(e.target, 'errorIcon') || isInDomClass(e.target, 'anticon-cross-circle-o');

    if (triggerByDelelte && _.isFunction(onDelete)) {
      onDelete(domKey);
    } else {
      scrollToField(domKey);
    }
  }

  // 错误节点是否在页面中被渲染(常见如当错误在TabContent中时，只有相应的tabTab被激活该内容才被渲染并能做滚动到视区控制)
  const domKeyDom = getFieldKeyDom(domKey);

  const clx = classNames(styles.errorListItem, { [styles.hidden]: !domKeyDom });

  return (
    <li key={domKey} className={clx} onClick={domKeyDom ? onClick : _.noop}>
      {!isNoparse(mode) && <Icon type="cross-circle-o" className={styles.errorIcon} />}
      <span className={styles.errorMessage}>{parse4Help(data, true)}</span>
      {showErrorKey && <div className={styles.errorField}>{domKey}</div>}
    </li>
  );
};

ErrorItemComp.propTypes = {
  showErrorKey: PropTypes.bool,
  domKey: PropTypes.string,
  data: PropTypes.object,
  errKeys: PropTypes.array,
  onDelete: PropTypes.func,
};

ErrorItemComp.defaultProps = {
  showErrorKey: false,
  domKey: '',
  data: {},
  errKeys: [],
  onDelete: _.noop,
};

export default ErrorItemComp;
