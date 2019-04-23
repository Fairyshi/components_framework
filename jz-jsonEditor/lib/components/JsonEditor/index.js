'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STATUS = exports.Toolbar = exports.EditPanel = exports.ComponentView = exports.PageView = exports.emitter = undefined;

var _Toolbar = require('./Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _EditPanel = require('./EditPanel');

var _EditPanel2 = _interopRequireDefault(_EditPanel);

var _ComponentView = require('./ComponentView');

var _ComponentView2 = _interopRequireDefault(_ComponentView);

var _PageView = require('./PageView');

var _PageView2 = _interopRequireDefault(_PageView);

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _constants = require('../../constants.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FbEventEmitter = require('fbemitter');

var emitter = new FbEventEmitter.EventEmitter();

_Controller2.default.EditTigger = _ComponentView2.default.EditTigger;
exports.default = _Controller2.default;
exports.emitter = emitter;
exports.PageView = _PageView2.default;
exports.ComponentView = _ComponentView2.default;
exports.EditPanel = _EditPanel2.default;
exports.Toolbar = _Toolbar2.default;
exports.STATUS = _constants.EDITOR_PANEL_STATUS;