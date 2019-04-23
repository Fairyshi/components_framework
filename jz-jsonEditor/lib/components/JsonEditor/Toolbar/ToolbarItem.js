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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ToolbarItem(_ref) {
  var label = _ref.label,
      children = _ref.children;

  var clx = {
    wraper: 'toolbar-item',
    header: 'toolbar-header',
    body: 'toolbar-body'
  };
  return _react2.default.createElement(
    'div',
    { className: clx.wraper },
    _react2.default.createElement(
      'span',
      { className: clx.header },
      label,
      '\uFF1A'
    ),
    _react2.default.createElement(
      'span',
      { className: clx.body },
      children
    )
  );
}

exports.default = ToolbarItem;


ToolbarItem.propTypes = {
  label: _propTypes2.default.string
};