'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addListenerOnce = exports.formatJsonData = exports.REG_OBJ = exports.sync2Storage = exports.getJsonDataFromStorage = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('./components/JsonEditor/index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = require('jsonic');

/**
 * 从localStorage中取出指定名称空间中指定key中的数据，并以json格式返回
 * @param {*} namespace
 * @param {*} key
 */
var getJsonDataFromStorage = exports.getJsonDataFromStorage = function getJsonDataFromStorage(namespace, key) {
  var dataStorage = localStorage.getItem(namespace);

  if (_lodash2.default.isEmpty(dataStorage)) return '';

  var data = _lodash2.default.get(dataStorage, key);

  if (_lodash2.default.isEmpty(data)) return '';

  return JSON.parse(data);
};

/**
 * 将json数据同步存储到localStorage中
 * @param {*} jsonData
 * @param {*} namespace
 * @param {*} key
 */
var sync2Storage = exports.sync2Storage = function sync2Storage(jsonData, namespace, key) {
  var dataStorage = localStorage.getItem(namespace);

  var result = void 0;
  if (!dataStorage) {
    result = (0, _defineProperty3.default)({}, key, jsonData);
  } else {
    var jsonNamespace = JSON.parse(dataStorage);
    jsonNamespace[key] = jsonData;
    result = jsonNamespace;
  }

  result = (0, _stringify2.default)(result);
  localStorage.setItem(namespace, result);

  return result;
};

var REG_OBJ = exports.REG_OBJ = /\{[\w\W]*\}/;

var formatJsonData = exports.formatJsonData = function formatJsonData(jsonData) {
  if (_lodash2.default.isEmpty(jsonData)) return jsonData;

  var formattedData = _lodash2.default.reduce(jsonData, function (prev, value, key) {
    var vl = typeof value === 'string' && REG_OBJ.test(value) ? jsonParser(value) : value;
    prev[key] = vl;
    return prev;
  }, {});
  return formattedData;
};

var addListenerOnce = exports.addListenerOnce = function addListenerOnce(listenerType, callback) {
  var listenerCbs = _index.emitter.listeners(listenerType);

  if (_lodash2.default.isEmpty(listenerCbs)) {
    _index.emitter.addListener(listenerType, callback);
  }
};