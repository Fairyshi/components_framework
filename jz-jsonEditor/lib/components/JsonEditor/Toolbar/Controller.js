'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

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

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _STR_COMPONENT;

// Toolbar中的 item


var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require('../../../constants');

var _Theme = require('./Theme');

var _Theme2 = _interopRequireDefault(_Theme);

var _Collapsed = require('./Collapsed');

var _Collapsed2 = _interopRequireDefault(_Collapsed);

var _EnableClipboard = require('./EnableClipboard');

var _EnableClipboard2 = _interopRequireDefault(_EnableClipboard);

var _CollapseStringsAfter = require('./CollapseStringsAfter');

var _CollapseStringsAfter2 = _interopRequireDefault(_CollapseStringsAfter);

var _IconStyle = require('./IconStyle');

var _IconStyle2 = _interopRequireDefault(_IconStyle);

var _IndentWidth = require('./IndentWidth');

var _IndentWidth2 = _interopRequireDefault(_IndentWidth);

var _DisplayDataTypes = require('./DisplayDataTypes');

var _DisplayDataTypes2 = _interopRequireDefault(_DisplayDataTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* FILEINPUT,
  FILEOUTPUT, */

var MODE_TOOLTYPE_COMMON = ['theme', 'collapsed', 'enableClipboard', 'collapseStringsAfter', 'iconStyle', 'indentWidth', 'displayDataTypes'];
var MODE_TOOLTYPE = {
  COMPONENT: MODE_TOOLTYPE_COMMON,
  PAGE: [].concat(MODE_TOOLTYPE_COMMON) /* MODE_TOOLTYPE_COMMON.concat([FILEINPUT, FILEOUTPUT]) */
};
var STR_COMPONENT = (_STR_COMPONENT = {
  theme: _Theme2.default,
  collapsed: _Collapsed2.default,
  enableClipboard: _EnableClipboard2.default,
  collapseStringsAfter: _CollapseStringsAfter2.default
}, (0, _defineProperty3.default)(_STR_COMPONENT, 'enableClipboard', _EnableClipboard2.default), (0, _defineProperty3.default)(_STR_COMPONENT, 'iconStyle', _IconStyle2.default), (0, _defineProperty3.default)(_STR_COMPONENT, 'indentWidth', _IndentWidth2.default), (0, _defineProperty3.default)(_STR_COMPONENT, 'displayDataTypes', _DisplayDataTypes2.default), _STR_COMPONENT);
var SORT_SQUENCE = ['theme', 'iconStyle', 'indentWidth', 'collapseStringsAfter', 'collapsed', 'displayDataTypes', 'enableClipboard'];

var ToolbarController = function (_PureComponent) {
  (0, _inherits3.default)(ToolbarController, _PureComponent);

  function ToolbarController() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ToolbarController);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ToolbarController.__proto__ || (0, _getPrototypeOf2.default)(ToolbarController)).call.apply(_ref, [this].concat(args))), _this), _this.change = function (type) {
      return function (value) {
        var _this$props = _this.props,
            data = _this$props.data,
            onChange = _this$props.onChange;

        var newData = (0, _extends4.default)({}, data, (0, _defineProperty3.default)({}, type, value));
        onChange(newData);
      };
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ToolbarController, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          mode = _props.mode,
          data = _props.data;

      var tooltypes = MODE_TOOLTYPE[mode];

      return _react2.default.createElement(
        'div',
        { className: 'json-editor-toolbar' },
        _react2.default.createElement(
          'div',
          { className: 'json-editor-toolbar-inner' },
          _react2.default.createElement(
            'div',
            { className: 'json-toolbox-title' },
            _constants.I18N.toolbox.title
          ),
          _react2.default.createElement(
            'ul',
            null,
            ' ',
            (0, _keys2.default)(data).filter(function (type) {
              return tooltypes.includes(type);
            }).sort(function (a, b) {
              return SORT_SQUENCE.indexOf(a) > SORT_SQUENCE.indexOf(b);
            }).map(function (type) {
              var value = data[type];
              var Comp = STR_COMPONENT[type];
              var key = 'toolbox-item-' + type;
              return _react2.default.createElement(
                'li',
                { key: key },
                _react2.default.createElement(Comp, { value: value, onChange: _this2.change(type) })
              );
            }),
            ' '
          )
        )
      );
    }
  }]);
  return ToolbarController;
}(_react.PureComponent);

ToolbarController.propTypes = {
  mode: _propTypes2.default.string,
  data: _propTypes2.default.object,
  onChange: _propTypes2.default.func
};
exports.default = ToolbarController;