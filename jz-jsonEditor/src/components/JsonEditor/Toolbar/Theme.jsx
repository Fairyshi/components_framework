import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import {Select} from 'antd';
const Option = Select.Option;
import {I18N} from '../../../constants';
import ToolbarItem from './ToolbarItem';

function Theme({value, onChange}) {
  return (
    <ToolbarItem label={I18N.label.theme}>
      <Select value={value} onChange={onChange}>
        {I18N.themes.map(({value, label}) => <Option key={value} value={value}>{label}</Option>)}
      </Select>
    </ToolbarItem>
  );
}

export default Theme;

Theme.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};
