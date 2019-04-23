import PropTypes, {object} from 'prop-types';
import React, {PureComponent} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {MODE} from '../../constants';
import ComponentView from './ComponentView';
import PageView from './PageView';
import Toolbar from './Toolbar';
import {KEY_IN_STORE, JSON_EDITOR_CONFIG, JSON_EDITOR_EVENT, EDITOR_PANEL_STATUS, JSON_EDITED_EVENT} from '../../constants';
import {getJsonDataFromStorage, sync2Storage, addListenerOnce, REG_OBJ} from '../../util';
import { emitter } from './index';

import '../index.less';

import jsonData from '../../mock/json';

const jsonParser = require('jsonic');

export default class JsonEditorController extends PureComponent {
  static propTypes = {
    status: PropTypes.string,
    // 应用场景
    mode: PropTypes.string,
    // open or close
    status: PropTypes.string,
    toggle: PropTypes.func,
    keyInStore: PropTypes.string,
    currentKey: PropTypes.string,
    header: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  static defaultProps = {
    mode: MODE.COMPONENT,
    status: EDITOR_PANEL_STATUS.close,
    // loacalstorage 中的名称空间
    keyInStore: KEY_IN_STORE,
    // loacalstorage 中的名称空间中存储的键
    defaultCurrentKey: 'jsonKey',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      jsonData,
      currentKey: props.currentKey || props.defaultCurrentKey,
      jsonEditorConfig: {...JSON_EDITOR_CONFIG},
    };
  }

  componentDidMount() {
    if (!this.state.jsonData) {
      this.updateJsonData(null, true);
    }

    this.watchEditorEvent();
  }

  // 监听json编辑触发键的点击事件：同步触发键中的信息到localStorage & 触发编辑面板的展示
  watchEditorEvent = () => {
    const { status } = this.props;
    const self = this;
    const { close } = EDITOR_PANEL_STATUS;

    addListenerOnce(JSON_EDITOR_EVENT, jsonInfo => {
      if (status === close) {
        self.triggeredByEditEvent = true;
        self.handleEditorEvent(jsonInfo);
      }
    });
  }

  // jsonInfo: {[currentKey]: jsonData}
  handleEditorEvent = jsonInfo => {
    const {keyInStore} = this.props;

    if (_.size(jsonInfo)) {
      const currentKey = Object.keys(jsonInfo)[0];
      const jsonData = jsonInfo[currentKey];
      
      this.setState({ currentKey });

      sync2Storage(jsonData, keyInStore, currentKey);
      this.updateJsonData(jsonData, false, true);

      this.togglePreview();
    }
  }

  changeJsonData = jsonData => {
    const {keyInStore, mode} = this.props;
    const {currentKey} = this.state;

    sync2Storage(jsonData, keyInStore, currentKey);
    this.updateJsonData(jsonData);

    // MODE为COMPONENT时，点击编辑触发键触发
    if(mode === MODE.COMPONENT && this.triggeredByEditEvent) {
      this.notifyForEditedEvent(jsonData);
    }
  };

  notifyForEditedEvent = jsonData => {
    const { currentKey } = this.state;
    const data = { jsonData, currentKey };
    emitter.emit(JSON_EDITED_EVENT, data);
  }

  updateJsonData = (jsonData, fromStorage) => {
    const {keyInStore} = this.props;
    const {currentKey} = this.state;

    if (fromStorage) {
      jsonData = getJsonDataFromStorage(keyInStore, currentKey);
    }

    if (_.isString(jsonData)) {
      if (_.isEmpty(jsonData)) {
        jsonData = {};
        this.setState({jsonData});
      } else if (REG_OBJ.test(jsonData)) {
        jsonData = jsonParser(jsonData);
        this.setState({jsonData});
      }
    } 
  };

  togglePreview = () => {
    if (this.props.status === EDITOR_PANEL_STATUS.open) {
      this.triggeredByEditEvent = false; 
    } 
    this.props.onToggle();
  };

  changeJsonEditorConfig = jsonEditorConfig => {
    this.setState({jsonEditorConfig});
  };

  getHeader = () => {
    const {header} = this.props;

    return header ? header : null;
  }

  renderPreview() {
    const {status, header, mode} = this.props;
    const {jsonData, jsonEditorConfig} = this.state;
    return (
      <ComponentView
        mode={mode}
        jsonEditorConfig={jsonEditorConfig}
        status={status}
        jsonData={jsonData}
        onToggle={this.togglePreview}
        onChange={this.changeJsonData}
        onChangeConfig={this.changeJsonEditorConfig}
        header={this.getHeader()}
      />
    );
  }

  renderPage() {
    const {header, mode} = this.props;
    const {jsonData, jsonEditorConfig} = this.state;

    return (
      <PageView
        mode={mode}
        jsonEditorConfig={jsonEditorConfig}
        status={status}
        jsonData={jsonData}
        onChange={this.changeJsonData}
        onChangeConfig={this.changeJsonEditorConfig}
        header={this.getHeader()}
      />
    );
  }

  render() {
    const {mode, status} = this.props;

    const clx = classNames('json-editor-controller');
    return (
      <div>
        {mode === MODE.COMPONENT ? this.renderPreview() : this.renderPage()}
      </div>
    );
  }
}
