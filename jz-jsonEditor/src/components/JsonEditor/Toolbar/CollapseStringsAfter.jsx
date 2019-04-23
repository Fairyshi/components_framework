import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { Input } from 'antd';
import {I18N} from '../../../constants';
import ToolbarItem from './ToolbarItem';

function CollapseStringsAfter({value, onChange}) {
  const label = I18N.label.collapseStringsAfter;
  const props = {
    value: Number(value),
    type: 'number',
    style: {width: '60px'},
    onChange: e => onChange(e.target.value),
  };
  return (
    <ToolbarItem label={label}>
      <Input {...props} />
    </ToolbarItem>
  );
}

export default CollapseStringsAfter;

CollapseStringsAfter.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  onChange: PropTypes.func,
};
