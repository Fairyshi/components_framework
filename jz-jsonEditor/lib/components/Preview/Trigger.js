'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @component 预览功能的触发组件
 * 点击可以打开预览框
 */
function PreviewTrigger(_ref) {
  var visible = _ref.visible,
      _ref$previewable = _ref.previewable,
      previewable = _ref$previewable === undefined ? true : _ref$previewable,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      onOpen = _ref.onOpen,
      children = _ref.children;

  var clx = (0, _classnames2.default)('preview-trigger', { visible: visible, disabled: !previewable });
  var props = {
    style: style,
    className: clx,
    onClick: previewable ? onOpen : null
  };
  return _react2.default.createElement(
    'div',
    props,
    children
  );
}

exports.default = PreviewTrigger;


PreviewTrigger.propTypes = {
  visible: _propTypes2.default.bool,
  previewable: _propTypes2.default.bool,
  style: _propTypes2.default.objectOf(_propTypes2.default.any),
  onOpen: _propTypes2.default.func,
  children: _propTypes2.default.node
};