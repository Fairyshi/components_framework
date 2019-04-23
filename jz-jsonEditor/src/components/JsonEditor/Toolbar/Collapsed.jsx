import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { Checkbox } from 'antd';
import {I18N} from '../../../constants';
import ToolbarItem from './ToolbarItem';

function Collapsed({value, onChange}) {
  return (
    <ToolbarItem label={I18N.label.collapsed}>
      <Checkbox checked={value} onChange={e => { onChange(e.target.checked); }} />
    </ToolbarItem>
  );
}

export default Collapsed;

Collapsed.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
};
