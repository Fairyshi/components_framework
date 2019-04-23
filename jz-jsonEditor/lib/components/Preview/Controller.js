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

var _Trigger = require('./Trigger');

var _Trigger2 = _interopRequireDefault(_Trigger);

var _Wrapper = require('./Wrapper');

var _Wrapper2 = _interopRequireDefault(_Wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 收起状态 or 打开状态
var STATUS = {
  CLOSE: 'close',
  OPEN: 'open'
};

var PreviewController = function (_PureComponent) {
  (0, _inherits3.default)(PreviewController, _PureComponent);

  function PreviewController(props) {
    (0, _classCallCheck3.default)(this, PreviewController);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PreviewController.__proto__ || (0, _getPrototypeOf2.default)(PreviewController)).call(this, props));

    _this.state = {};
    return _this;
  }

  (0, _createClass3.default)(PreviewController, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          status = _props.status,
          trigger = _props.trigger,
          header = _props.header,
          children = _props.children,
          previewable = _props.previewable,
          hasGlobalTrigger = _props.hasGlobalTrigger,
          onOpen = _props.onOpen,
          onClose = _props.onClose;

      var clx = (0, _classnames2.default)('preview-controller', status);

      var jsxGlobalTrigger = null;
      if (hasGlobalTrigger) {
        var propsTrigger = {
          previewable: previewable,
          visible: status === STATUS.CLOSE,
          onOpen: onOpen
        };
        jsxGlobalTrigger = _react2.default.createElement(
          _Trigger2.default,
          propsTrigger,
          trigger
        );
      }

      var propsWrapper = {
        visible: status === STATUS.OPEN,
        header: header,
        onClose: onClose
      };

      return _react2.default.createElement(
        'div',
        { className: clx },
        jsxGlobalTrigger,
        _react2.default.createElement(
          _Wrapper2.default,
          propsWrapper,
          children
        )
      );
    }
  }]);
  return PreviewController;
}(_react.PureComponent);

PreviewController.propTypes = {
  status: _propTypes2.default.string,
  // trigger中的内容
  trigger: _propTypes2.default.any,
  // 预览展开时，JSON编辑区顶部的组件
  header: _propTypes2.default.any,
  // 收起模式下，点击trigger
  onOpen: _propTypes2.default.func,
  // 打开模式下，点击关闭or收起
  onClose: _propTypes2.default.func,
  // 是否能预览
  previewable: _propTypes2.default.bool,
  // 是否显示右下角的全局预览触发器
  hasGlobalTrigger: _propTypes2.default.bool
};
PreviewController.defaultProps = {
  status: STATUS.CLOSE,
  previewable: true,
  hasGlobalTrigger: true
};
exports.default = PreviewController;