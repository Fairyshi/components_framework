import PropTypes from 'prop-types';
import React from 'react';

import styles from 'antd/es/style/index.css';

// 布局组件：两端布局  children的最后一项靠右，其他靠左
function FlexJustifyComp({ children = [], reverse = false }) {
  const count = React.Children.count(children);
  if (!count) return children;

  const arrMain = [];
  React.Children.forEach(children, (child, index) => {
    if (index < count - 1) arrMain.push(child);
  });

  const jsxLast = reverse ? (
    <div className={reverse ? 'flex-main text-right' : ''}>{children[count - 1]}</div>
  ) : (
    children[count - 1]
  );

  return (
    <div className="flex-wrap flex-justify">
      <div className={reverse ? '' : 'flex-main'}>{arrMain}</div>
      {jsxLast}
    </div>
  );
}

export default FlexJustifyComp;
