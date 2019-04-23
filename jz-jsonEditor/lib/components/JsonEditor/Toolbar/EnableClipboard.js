'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checkbox = require('antd/lib/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

require('antd/lib/checkbox/style/css');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _constants = require('../../../constants');

var _ToolbarItem = require('./ToolbarItem');

var _ToolbarItem2 = _interopRequireDefault(_ToolbarItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EnableClipboard(_ref) {
  var value = _ref.value,
      _onChange = _ref.onChange;

  return _react2.default.createElement(
    _ToolbarItem2.default,
    { label: _constants.I18N.label.enableClipboard },
    _react2.default.createElement(_checkbox2.default, { checked: value, onChange: function onChange(e) {
        _onChange(e.target.checked);
      } })
  );
}

exports.default = EnableClipboard;


EnableClipboard.propTypes = {
  value: _propTypes2.default.bool,
  onChange: _propTypes2.default.func
};