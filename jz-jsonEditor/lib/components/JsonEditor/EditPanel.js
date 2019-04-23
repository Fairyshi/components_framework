'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _reactJsonView = require('react-json-view');

var _reactJsonView2 = _interopRequireDefault(_reactJsonView);

var _util = require('../../util');

var _constants = require('../../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditPanel = function (_PureComponent) {
  (0, _inherits3.default)(EditPanel, _PureComponent);

  function EditPanel(props) {
    (0, _classCallCheck3.default)(this, EditPanel);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EditPanel.__proto__ || (0, _getPrototypeOf2.default)(EditPanel)).call(this, props));

    _this.changeJsonData = function (operType) {
      return function (event) {
        if (operType in _constants.OPER_TYPE) {
          var jsonData = event.updated_src;

          var formattedData = (0, _util.formatJsonData)(jsonData);
          _this.setState({ data: formattedData });
          _this.props.onChange(formattedData);
        }
      };
    };

    var data = props.data,
        jsonEditorConfig = props.jsonEditorConfig;


    _this.state = { data: data, jsonEditorConfig: jsonEditorConfig };
    return _this;
  }

  (0, _createClass3.default)(EditPanel, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if ((0, _stringify2.default)(nextProps.data) !== (0, _stringify2.default)(this.state.data)) {
        this.setState({ data: nextProps.data });
      }
      if ((0, _stringify2.default)(nextProps.jsonEditorConfig) !== (0, _stringify2.default)(this.state.jsonEditorConfig)) {
        this.setState({ jsonEditorConfig: nextProps.jsonEditorConfig });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          data = _state.data,
          jsonEditorConfig = _state.jsonEditorConfig;
      var onAdd = jsonEditorConfig.onAdd,
          onEdit = jsonEditorConfig.onEdit,
          onDelete = jsonEditorConfig.onDelete,
          others = (0, _objectWithoutProperties3.default)(jsonEditorConfig, ['onAdd', 'onEdit', 'onDelete']);

      var props = (0, _extends3.default)({}, others, {
        src: data,
        name: null,
        onAdd: onAdd ? function (event) {
          return _this2.changeJsonData(_constants.OPER_TYPE.ADD).call(_this2, event);
        } : false,
        onEdit: onEdit ? function (event) {
          return _this2.changeJsonData(_constants.OPER_TYPE.EDIT).call(_this2, event);
        } : false,
        onDelete: onDelete ? function (event) {
          return _this2.changeJsonData(_constants.OPER_TYPE.DELETE).call(_this2, event);
        } : false
      });
      var clx = (0, _classnames2.default)('json-editor-panel');
      return _react2.default.createElement(
        'div',
        { className: clx },
        _react2.default.createElement(_reactJsonView2.default, props)
      );
    }
  }]);
  return EditPanel;
}(_react.PureComponent);

EditPanel.propTypes = {
  onChage: _propTypes2.default.func,
  data: _propTypes2.default.any
};
exports.default = EditPanel;