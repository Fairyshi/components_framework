import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

/**
 * @component 预览功能的触发组件
 * 点击可以打开预览框
 */
function PreviewTrigger({visible, previewable = true, style = {}, onOpen, children}) {
  const clx = classNames('preview-trigger', { visible, disabled: !previewable });
  const props = {
    style,
    className: clx,
    onClick: previewable ? onOpen : null,
  };
  return (
    <div {...props}>
      {children}
    </div>
  );
}

export default PreviewTrigger;

PreviewTrigger.propTypes = {
  visible: PropTypes.bool,
  previewable: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.any),
  onOpen: PropTypes.func,
  children: PropTypes.node,
};
