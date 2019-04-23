'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('../index');

var _util = require('../../../util');

var _constants = require('../../../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditTigger = function (_PureComponent) {
  (0, _inherits3.default)(EditTigger, _PureComponent);

  function EditTigger() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, EditTigger);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = EditTigger.__proto__ || (0, _getPrototypeOf2.default)(EditTigger)).call.apply(_ref, [this].concat(args))), _this), _this.watchEditorEvent = function () {
      var onChange = _this.props.onChange;
      // JSON编辑器编辑完成后json变化触发

      (0, _util.addListenerOnce)(_constants.JSON_EDITED_EVENT, function (jsonInfo) {
        if (_lodash2.default.isFunction(onChange)) {
          onChange(jsonInfo);
        }
      });
    }, _this.handleClick = function () {
      var _this$props = _this.props,
          currentKey = _this$props.currentKey,
          data = _this$props.data;

      _index.emitter.emit(_constants.JSON_EDITOR_EVENT, (0, _defineProperty3.default)({}, currentKey, data));
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(EditTigger, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.watchEditorEvent();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          _props$disabled = _props.disabled,
          disabled = _props$disabled === undefined ? false : _props$disabled,
          children = _props.children;

      return _react2.default.createElement(
        'div',
        { className: 'json-editor-trigger' },
        disabled ? _react2.default.createElement(
          'div',
          { className: 'editor-trigger disabled' },
          children || _react2.default.createElement(_icon2.default, { type: 'edit', disabled: true })
        ) : _react2.default.createElement(
          'div',
          { className: 'editor-trigger', onClick: function onClick() {
              _this2.handleClick();
            } },
          children || _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement(_icon2.default, { type: 'edit' }),
            'JSON'
          )
        )
      );
    }
  }]);
  return EditTigger;
}(_react.PureComponent);

EditTigger.propTypes = {
  disabled: _propTypes2.default.bool,
  currentKey: _propTypes2.default.string,
  data: _propTypes2.default.objectOf(_propTypes2.default.any)
};
exports.default = EditTigger;