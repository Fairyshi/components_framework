import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import { toArr } from '../util';

// import styles from '@alipay/jz-cascader-tree/assets/index.less';

/**
 * @component {ui} 
 * @param {array} data [[...groupitems1], [...groupitems2], ...]
 */
function CascaderGroups({ className, data = [], style, children }) {
  const clx = classNames(
    className, 
    "cascadertree-cascadergroupw"
  );
  return (
    <div className={clx}>
      <div className="cascadertree-cascadergroupinner">
      { toArr(data)
        .map(
          (groupItems, index) => 
            <div 
              key={index} 
              className="cascadertree-cascadergroup"
            >
              {groupItems}
            </div>
          )
      }
      </div>
    </div>
  );
}

export default CascaderGroups;

CascaderGroups.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};
