import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

function ToolbarItem({label, children}) {
  const clx = {
    wraper: 'toolbar-item',
    header: 'toolbar-header',
    body: 'toolbar-body',
  };
  return (
    <div className={clx.wraper}>
      <span className={clx.header}>{label}：</span>
      <span className={clx.body}>{children}</span>
    </div>
  );
}

export default ToolbarItem;

ToolbarItem.propTypes = {
  label: PropTypes.string,
};
