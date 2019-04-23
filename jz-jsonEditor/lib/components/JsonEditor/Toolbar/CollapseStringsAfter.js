'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _input = require('antd/lib/input');

var _input2 = _interopRequireDefault(_input);

require('antd/lib/input/style/css');

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

function CollapseStringsAfter(_ref) {
  var value = _ref.value,
      _onChange = _ref.onChange;

  var label = _constants.I18N.label.collapseStringsAfter;
  var props = {
    value: Number(value),
    type: 'number',
    style: { width: '60px' },
    onChange: function onChange(e) {
      return _onChange(e.target.value);
    }
  };
  return _react2.default.createElement(
    _ToolbarItem2.default,
    { label: label },
    _react2.default.createElement(_input2.default, props)
  );
}

exports.default = CollapseStringsAfter;


CollapseStringsAfter.propTypes = {
  value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  onChange: _propTypes2.default.func
};