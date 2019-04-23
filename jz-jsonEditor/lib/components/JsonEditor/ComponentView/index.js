'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditTigger = exports.PreviewTrigger = undefined;

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _PreviewTrigger = require('./PreviewTrigger');

var _PreviewTrigger2 = _interopRequireDefault(_PreviewTrigger);

var _EditTigger = require('./EditTigger');

var _EditTigger2 = _interopRequireDefault(_EditTigger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Controller2.default.EditTigger = _EditTigger2.default;
exports.default = _Controller2.default;
exports.PreviewTrigger = _PreviewTrigger2.default;
exports.EditTigger = _EditTigger2.default;