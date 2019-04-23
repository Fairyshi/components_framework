import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Tag } from 'antd';
import classNames from 'classnames';

import { 
  noop, 
  isObject, 
  getItemDesc, 
  getItemVal 
} from '../util';

/**
 * @component 所选项预览列表
 * 1. 只读 
 * 2. 删除单项 
 * 3. 清除所有项
 */
function PreviewList({ 
  readOnly, 
  className, 
  data, 
  onDel, 
  renderItem,
  previewClear,
  emptyContent,
}) {
  const clx = classNames(
    className, 
    "cascadertree-previeww"
  );

  const jsxClearTrigger = previewClear 
    ? React.cloneElement(previewClear, { onClick: onClear || noop })
    : <Icon type="close" onClick={onClear || noop}/>;

  return (
    <div className={clx}>
      <div className="cascadertree-previewinner">
        { data.length === 0
            ? emptyContent
            : data
              .filter(Boolean)
              .map(item => {
                let jsxTag;
                if (typeof renderItem === 'function') {
                  jsxTag = renderItem(item);
                } else if (isObject(item)) {
                  jsxTag = getItemDesc(item);
                } else {
                  jsxTag = item;
                }
    
                if (!jsxTag) return null;
     
                const val = isObject(item)
                  ? getItemVal(item)
                  : item;
    
                return readOnly 
                  ? <Tag key={val}>{jsxTag}</Tag>
                  : <Tag 
                      key={val}
                      closable
                      onClose={onDel.bind(null, val)}
                    >
                      {jsxTag}
                    </Tag>
              })
              .filter(Boolean)
        }
      </div>
      <div className="cascadertree-clearw">
        {jsxClearTrigger}
      </div>      
    </div>
  );
}

export default PreviewList;

PreviewList.defaultProps = {
  readOnly: false,
  data: [],
  onDel: undefined,
  renderItem: undefined,
  emptyContent: undefined,
};

PreviewList.propTypes = {
  // 只读
  readOnly: PropTypes.bool,
  // 列表数据
  data: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  // 删除单个
  onDel: PropTypes.func,
  // 每项的显示方式
  renderItem: PropTypes.func,
  emptyContent: PropTypes.node,
};
