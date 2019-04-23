import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { Checkbox } from 'antd';
import {I18N} from '../../../constants';
import ToolbarItem from './ToolbarItem';

function DisplayDataTypes({value, onChange}) {
  return (
    <ToolbarItem label={I18N.label.displayDataTypes}>
      <Checkbox checked={value} onChange={e => { onChange(e.target.checked); }} />
    </ToolbarItem>
  );
}

export default DisplayDataTypes;

DisplayDataTypes.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
};
