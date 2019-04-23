/*
 * @Author: 嘉竹 (shifei.sf)
 */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { getElementById } from './util';

/**
 * @component 复制到剪贴板
 */
export default class ClipBoard extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
  };

  static defaultProps = {
    value: '',
  };
  
  handleCopyToClipboard = () => {
    const { value } = this.props;
    const clipBoardProxy = getElementById('clipBoard', 'input', [
      ['value', value],
      ['class', 'hiddeninput'],
    ]);
    setTimeout(() => {
      clipBoardProxy.select();
      document.execCommand('copy');
    }, 0);
  };

  render() {
    return (
      <div 
        className="clipboard-wrap"
        onClick={this.handleCopyToClipboard}
      >
        <Icon type="copy" />
      </div>
    );
  }
}

