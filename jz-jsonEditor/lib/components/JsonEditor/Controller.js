'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _JsonEditorController;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require('../../constants');

var _ComponentView = require('./ComponentView');

var _ComponentView2 = _interopRequireDefault(_ComponentView);

var _PageView = require('./PageView');

var _PageView2 = _interopRequireDefault(_PageView);

var _Toolbar = require('./Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _util = require('../../util');

var _index = require('./index');

require('../index.less');

var _json = require('../../mock/json');

var _json2 = _interopRequireDefault(_json);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = require('jsonic');

var JsonEditorController = function (_PureComponent) {
  (0, _inherits3.default)(JsonEditorController, _PureComponent);

  function JsonEditorController(props) {
    (0, _classCallCheck3.default)(this, JsonEditorController);

    var _this = (0, _possibleConstructorReturn3.default)(this, (JsonEditorController.__proto__ || (0, _getPrototypeOf2.default)(JsonEditorController)).call(this, props));

    _this.watchEditorEvent = function () {
      var status = _this.props.status;

      var self = _this;
      var close = _constants.EDITOR_PANEL_STATUS.close;


      (0, _util.addListenerOnce)(_constants.JSON_EDITOR_EVENT, function (jsonInfo) {
        if (status === close) {
          self.triggeredByEditEvent = true;
          self.handleEditorEvent(jsonInfo);
        }
      });
    };

    _this.handleEditorEvent = function (jsonInfo) {
      var keyInStore = _this.props.keyInStore;


      if (_lodash2.default.size(jsonInfo)) {
        var currentKey = (0, _keys2.default)(jsonInfo)[0];
        var _jsonData = jsonInfo[currentKey];

        _this.setState({ currentKey: currentKey });

        (0, _util.sync2Storage)(_jsonData, keyInStore, currentKey);
        _this.updateJsonData(_jsonData, false, true);

        _this.togglePreview();
      }
    };

    _this.changeJsonData = function (jsonData) {
      var _this$props = _this.props,
          keyInStore = _this$props.keyInStore,
          mode = _this$props.mode;
      var currentKey = _this.state.currentKey;


      (0, _util.sync2Storage)(jsonData, keyInStore, currentKey);
      _this.updateJsonData(jsonData);

      // MODE为COMPONENT时，点击编辑触发键触发
      if (mode === _constants.MODE.COMPONENT && _this.triggeredByEditEvent) {
        _this.notifyForEditedEvent(jsonData);
      }
    };

    _this.notifyForEditedEvent = function (jsonData) {
      _index.emitter.emit(_constants.JSON_EDITED_EVENT, jsonData);
    };

    _this.updateJsonData = function (jsonData, fromStorage) {
      var keyInStore = _this.props.keyInStore;
      var currentKey = _this.state.currentKey;


      if (fromStorage) {
        jsonData = (0, _util.getJsonDataFromStorage)(keyInStore, currentKey);
      }

      if (_lodash2.default.isString(jsonData)) {
        if (_lodash2.default.isEmpty(jsonData)) {
          jsonData = {};
          _this.setState({ jsonData: jsonData });
        } else if (_util.REG_OBJ.test(jsonData)) {
          jsonData = jsonParser(jsonData);
          _this.setState({ jsonData: jsonData });
        }
      }
    };

    _this.togglePreview = function () {
      if (_this.props.status === _constants.EDITOR_PANEL_STATUS.open) {
        _this.triggeredByEditEvent = false;
      }
      _this.props.onToggle();
    };

    _this.changeJsonEditorConfig = function (jsonEditorConfig) {
      _this.setState({ jsonEditorConfig: jsonEditorConfig });
    };

    _this.getHeader = function () {
      var header = _this.props.header;


      return header ? header : null;
    };

    _this.state = {
      jsonData: _json2.default,
      currentKey: props.currentKey || props.defaultCurrentKey,
      jsonEditorConfig: (0, _extends3.default)({}, _constants.JSON_EDITOR_CONFIG)
    };
    return _this;
  }

  (0, _createClass3.default)(JsonEditorController, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.state.jsonData) {
        this.updateJsonData(null, true);
      }

      this.watchEditorEvent();
    }

    // 监听json编辑触发键的点击事件：同步触发键中的信息到localStorage & 触发编辑面板的展示


    // jsonInfo: {[currentKey]: jsonData}

  }, {
    key: 'renderPreview',
    value: function renderPreview() {
      var _props = this.props,
          status = _props.status,
          header = _props.header,
          mode = _props.mode;
      var _state = this.state,
          jsonData = _state.jsonData,
          jsonEditorConfig = _state.jsonEditorConfig;

      return _react2.default.createElement(_ComponentView2.default, {
        mode: mode,
        jsonEditorConfig: jsonEditorConfig,
        status: status,
        jsonData: jsonData,
        onToggle: this.togglePreview,
        onChange: this.changeJsonData,
        onChangeConfig: this.changeJsonEditorConfig,
        header: this.getHeader()
      });
    }
  }, {
    key: 'renderPage',
    value: function renderPage() {
      var _props2 = this.props,
          header = _props2.header,
          mode = _props2.mode;
      var _state2 = this.state,
          jsonData = _state2.jsonData,
          jsonEditorConfig = _state2.jsonEditorConfig;


      return _react2.default.createElement(_PageView2.default, {
        mode: mode,
        jsonEditorConfig: jsonEditorConfig,
        status: status,
        jsonData: jsonData,
        onChange: this.changeJsonData,
        onChangeConfig: this.changeJsonEditorConfig,
        header: this.getHeader()
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          mode = _props3.mode,
          status = _props3.status;


      var clx = (0, _classnames2.default)('json-editor-controller');
      return _react2.default.createElement(
        'div',
        null,
        mode === _constants.MODE.COMPONENT ? this.renderPreview() : this.renderPage()
      );
    }
  }]);
  return JsonEditorController;
}(_react.PureComponent);

JsonEditorController.propTypes = (_JsonEditorController = {
  status: _propTypes2.default.string,
  // 应用场景
  mode: _propTypes2.default.string
}, (0, _defineProperty3.default)(_JsonEditorController, 'status', _propTypes2.default.string), (0, _defineProperty3.default)(_JsonEditorController, 'toggle', _propTypes2.default.func), (0, _defineProperty3.default)(_JsonEditorController, 'keyInStore', _propTypes2.default.string), (0, _defineProperty3.default)(_JsonEditorController, 'currentKey', _propTypes2.default.string), (0, _defineProperty3.default)(_JsonEditorController, 'header', _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])), _JsonEditorController);
JsonEditorController.defaultProps = {
  mode: _constants.MODE.COMPONENT,
  status: _constants.EDITOR_PANEL_STATUS.close,
  // loacalstorage 中的名称空间
  keyInStore: _constants.KEY_IN_STORE,
  // loacalstorage 中的名称空间中存储的键
  defaultCurrentKey: 'jsonKey',
  header: null
};
exports.default = JsonEditorController;