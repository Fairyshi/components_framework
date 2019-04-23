import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { Icon } from 'antd';

export default class PreviewWrapper extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    // 打开模式下，点击关闭or收起
    onClose: PropTypes.func,
    header: PropTypes.any,
  };

  static defaultProps = {
    visible: false,
  };

  close = () => {
    this.props.onClose();
  }

  render() {
    const { visible, header, children, namespace } = this.props;
    const clx = classNames('preview-wrapper', { visible });

    return (
      <div className={clx}>
        <div className="preview-wrapper-inner">
          <div className="preview-wrapper-head">
            <div className="json-preview-header">
              {header}
            </div>
            <div className="preview-close" onClick={() => this.close() }>
              <Icon type='close' />
            </div>
          </div>
          <div className="preview-wrapper-body">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
