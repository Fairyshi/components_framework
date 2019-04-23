import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { Empty } from 'antd';

import styles from './index.less';

/**
 * @component pure component template
 */
function {{PureComponentName}}({ readOnly, ...others }) {
  const {  } = others;

  return <Empty />;
}

export default {{PureComponentName}};
