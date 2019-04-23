import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox } from 'antd';

import { 
  noop,
  TiggerAll_ON_TEXT, 
  TiggerAll_OFF_TEXT 
} from '../util';

/**
 * @component 全选|取消全选
 */
function TiggerAll({ 
  readOnly, 
  checked, 
  indeterminate, 
  onText, 
  offText,
  onChange
}) {
  const label = checked ? onText : offText;

  const change = () => {
    if (readOnly) {
      return;
    }
    onChange();
  };

  return (
    <div className="todo">
      <Checkbox
        disabled={readOnly}
        checked={checked}
        indeterminate={indeterminate}
        onChange={change}
      >{label}</Checkbox>
    </div>
  );
}

export default TiggerAll;

TiggerAll.defaultProps = {
  readOnly: false,
  checked: false,
  indeterminate: false,
  onText: TiggerAll_ON_TEXT,
  offText: TiggerAll_OFF_TEXT,
  onChange: noop,
};

TiggerAll.propTypes = {
  // 只读
  readOnly: PropTypes.bool,
  // 是否选中
  checked: PropTypes.bool,
  // 是否半选
  indeterminate: PropTypes.bool,
  // checked为false时的提示
  onText: PropTypes.node,
  // checked为true时的提示
  offText: PropTypes.node,
  // 切换选中状态时的回调
  onChange: PropTypes.func,  
};


