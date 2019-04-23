import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import {Select} from 'antd';
const Option = Select.Option;
import {I18N} from '../../../constants';
import ToolbarItem from './ToolbarItem';

function IconStyle({value, onChange}) {
  return (
    <ToolbarItem label={I18N.label.iconStyle}>
      <Select value={value} onChange={onChange}>
        {I18N.iconStyles.map(({value, label}) => <Option key={value} value={value}>{label}</Option>)}
      </Select>
    </ToolbarItem>
  );
}

export default IconStyle;

IconStyle.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};
