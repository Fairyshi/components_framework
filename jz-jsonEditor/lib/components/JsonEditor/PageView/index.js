'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _EditPanel = require('../EditPanel');

var _EditPanel2 = _interopRequireDefault(_EditPanel);

var _Toolbar = require('../Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @page Json编辑管理页面的独立页面中的调用(对应此编辑器功能以组件的方式在页面中调用)
 */
var PageView = function (_PureComponent) {
  (0, _inherits3.default)(PageView, _PureComponent);

  function PageView() {
    (0, _classCallCheck3.default)(this, PageView);
    return (0, _possibleConstructorReturn3.default)(this, (PageView.__proto__ || (0, _getPrototypeOf2.default)(PageView)).apply(this, arguments));
  }

  (0, _createClass3.default)(PageView, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          mode = _props.mode,
          jsonData = _props.jsonData,
          jsonEditorConfig = _props.jsonEditorConfig,
          header = _props.header,
          onChange = _props.onChange,
          onChangeConfig = _props.onChangeConfig;


      return _react2.default.createElement(
        'div',
        { className: 'json-page-wrapper' },
        _react2.default.createElement(
          'div',
          { className: 'json-page-head' },
          _react2.default.createElement(
            'div',
            { className: 'json-page-header' },
            header
          ),
          _react2.default.createElement(_Toolbar2.default, {
            key: 'jsonEditorToolbar',
            mode: mode,
            data: jsonEditorConfig,
            onChange: onChangeConfig
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'json-page-body' },
          _react2.default.createElement(_EditPanel2.default, {
            jsonEditorConfig: jsonEditorConfig,
            data: jsonData,
            onChange: onChange
          })
        )
      );
    }
  }]);
  return PageView;
}(_react.PureComponent);

PageView.propTypes = {
  mode: _propTypes2.default.string,
  jsonData: _propTypes2.default.objectOf(_propTypes2.default.any),
  // 对json-editor的配置，如可视化展示方式等
  jsonEditorConfig: _propTypes2.default.objectOf(_propTypes2.default.any),
  onChange: _propTypes2.default.func,
  onChangeConfig: _propTypes2.default.func,
  header: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
};
exports.default = PageView;