/*
 * @Author: 嘉竹 (shifei.sf)
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import { isNoparse } from '../../util';

import ErrorItem from './Item';
import cssStyles from './index.less';

/**
 * @component 校验结果信息汇总展示，支持点击清除
 */
const ErrorListComp = ({
  styles = {},
  errors,
  errKeys = [],
  showErrorKey = false,
  onDelete,
  UiList,
  UiItem,
  mode,
  lg,
}) => {
  if (_.isEmpty(errors) || _.isEmpty(errKeys)) return null;

  const UiItem_ = UiItem || ErrorItem;

  const errorItems = (isNoparse(mode) ? Object.keys(errors) : errKeys).map(key => (
    <UiItem_
      domKey={key}
      showErrorKey={showErrorKey}
      data={errors[key]}
      onDelete={onDelete}
      mode={mode}
      lg={lg}
    />
  ));

  const clx = classNames(cssStyles.errorList, { [cssStyles.errorListLg]: lg });

  return UiList ? (
    <UiList>{errorItems}</UiList>
  ) : (
    <ul style={styles} className={clx}>
      {errorItems}
    </ul>
  );
};

ErrorListComp.propTypes = {
  showErrorKey: PropTypes.bool,
  errors: PropTypes.object,
  styles: PropTypes.object,
  errKeys: PropTypes.array,
  onDelete: PropTypes.func,
  UiList: PropTypes.node,
  UiItem: PropTypes.node,
};

ErrorListComp.defaultProps = {
  showErrorKey: false,
  errors: {},
  styles: {},
  errKeys: [],
  onDelete: _.noop,
  UiList: null,
  UiItem: null,
};

export default ErrorListComp;
