import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'antd';

function PreviewTrigger({ visible }) {
  return (
    <div className='json-preview-trigger'>
      <Icon type="edit" />
      JSON
    </div>
  );
}

export default PreviewTrigger;

PreviewTrigger.propTypes = {
  visible: PropTypes.bool,
};
