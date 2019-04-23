'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

require('antd/lib/select/style/css');

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

var Option = _select2.default.Option;


function Theme(_ref) {
  var value = _ref.value,
      onChange = _ref.onChange;

  return _react2.default.createElement(
    _ToolbarItem2.default,
    { label: _constants.I18N.label.theme },
    _react2.default.createElement(
      _select2.default,
      { value: value, onChange: onChange },
      _constants.I18N.themes.map(function (_ref2) {
        var value = _ref2.value,
            label = _ref2.label;
        return _react2.default.createElement(
          Option,
          { key: value, value: value },
          label
        );
      })
    )
  );
}

exports.default = Theme;


Theme.propTypes = {
  value: _propTypes2.default.string,
  onChange: _propTypes2.default.func
};