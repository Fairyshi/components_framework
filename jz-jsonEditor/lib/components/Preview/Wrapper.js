'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

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

require('antd/lib/icon/style/css');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PreviewWrapper = function (_PureComponent) {
  (0, _inherits3.default)(PreviewWrapper, _PureComponent);

  function PreviewWrapper() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, PreviewWrapper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = PreviewWrapper.__proto__ || (0, _getPrototypeOf2.default)(PreviewWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.close = function () {
      _this.props.onClose();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(PreviewWrapper, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          visible = _props.visible,
          header = _props.header,
          children = _props.children,
          namespace = _props.namespace;

      var clx = (0, _classnames2.default)('preview-wrapper', { visible: visible });

      return _react2.default.createElement(
        'div',
        { className: clx },
        _react2.default.createElement(
          'div',
          { className: 'preview-wrapper-inner' },
          _react2.default.createElement(
            'div',
            { className: 'preview-wrapper-head' },
            _react2.default.createElement(
              'div',
              { className: 'json-preview-header' },
              header
            ),
            _react2.default.createElement(
              'div',
              { className: 'preview-close', onClick: function onClick() {
                  return _this2.close();
                } },
              _react2.default.createElement(_icon2.default, { type: 'close' })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'preview-wrapper-body' },
            children
          )
        )
      );
    }
  }]);
  return PreviewWrapper;
}(_react.PureComponent);

PreviewWrapper.propTypes = {
  visible: _propTypes2.default.bool,
  // 打开模式下，点击关闭or收起
  onClose: _propTypes2.default.func,
  header: _propTypes2.default.any
};
PreviewWrapper.defaultProps = {
  visible: false
};
exports.default = PreviewWrapper;