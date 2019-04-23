import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {Icon} from 'antd';
import EditPanel from '../EditPanel';
import Toolbar from '../Toolbar';

/**
 * @page Json编辑管理页面的独立页面中的调用(对应此编辑器功能以组件的方式在页面中调用)
 */
export default class PageView extends PureComponent {
  static propTypes = {
    mode: PropTypes.string,
    jsonData: PropTypes.objectOf(PropTypes.any),
    // 对json-editor的配置，如可视化展示方式等
    jsonEditorConfig: PropTypes.objectOf(PropTypes.any),
    onChange: PropTypes.func,
    onChangeConfig: PropTypes.func,
    header: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  render() {
    const {
      mode,
      jsonData,
      jsonEditorConfig,
      header,
      onChange,
      onChangeConfig,
    } = this.props;

    return (
      <div className="json-page-wrapper">
        <div className="json-page-head">
          <div className="json-page-header">{header}</div>
          <Toolbar
            key="jsonEditorToolbar"
            mode={mode}
            data={jsonEditorConfig}
            onChange={onChangeConfig}
          />
        </div>
        <div className="json-page-body">
          <EditPanel
            jsonEditorConfig={jsonEditorConfig}
            data={jsonData}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }
}
