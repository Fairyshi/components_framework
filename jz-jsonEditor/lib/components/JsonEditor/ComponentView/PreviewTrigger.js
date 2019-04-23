'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

require('antd/lib/icon/style/css');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PreviewTrigger(_ref) {
  var visible = _ref.visible;

  return _react2.default.createElement(
    'div',
    { className: 'json-preview-trigger' },
    _react2.default.createElement(_icon2.default, { type: 'edit' }),
    'JSON'
  );
}

exports.default = PreviewTrigger;


PreviewTrigger.propTypes = {
  visible: _propTypes2.default.bool
};