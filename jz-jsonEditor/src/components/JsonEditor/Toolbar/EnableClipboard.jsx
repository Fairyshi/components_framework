import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { Checkbox } from 'antd';
import {I18N} from '../../../constants';
import ToolbarItem from './ToolbarItem';

function EnableClipboard({value, onChange}) {
  return (
    <ToolbarItem label={I18N.label.enableClipboard}>
      <Checkbox checked={value} onChange={e => { onChange(e.target.checked); }} />
    </ToolbarItem>
  );
}

export default EnableClipboard;

EnableClipboard.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
};
