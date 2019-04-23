import _ from 'lodash';
import {emitter} from './components/JsonEditor/index.js';
const jsonParser = require('jsonic');

/**
 * 从localStorage中取出指定名称空间中指定key中的数据，并以json格式返回
 * @param {*} namespace
 * @param {*} key
 */
export const getJsonDataFromStorage = (namespace, key) => {
  const dataStorage = localStorage.getItem(namespace);

  if (_.isEmpty(dataStorage)) return '';

  const data = _.get(dataStorage, key);

  if (_.isEmpty(data)) return '';

  return JSON.parse(data);
};

/**
 * 将json数据同步存储到localStorage中
 * @param {*} jsonData
 * @param {*} namespace
 * @param {*} key
 */
export const sync2Storage = (jsonData, namespace, key) => {
  const dataStorage = localStorage.getItem(namespace);

  let result;
  if (!dataStorage) {
    result = {[key]: jsonData};
  } else {
    const jsonNamespace = JSON.parse(dataStorage);
    jsonNamespace[key] = jsonData;
    result = jsonNamespace;
  }

  result = JSON.stringify(result);
  localStorage.setItem(namespace, result);

  return result;
};

export const REG_OBJ = /\{[\w\W]*\}/;

export const formatJsonData = jsonData => {
  if (_.isEmpty(jsonData)) return jsonData;

  const formattedData = _.reduce(jsonData, (prev, value, key) => {
    const vl = typeof value === 'string' && REG_OBJ.test(value) ? jsonParser(value) : value;
    prev[key] = vl;
    return prev;
  }, {});
  return formattedData;
};

export const addListenerOnce = (listenerType, callback) => {
  const listenerCbs = emitter.listeners(listenerType);

  if (_.isEmpty(listenerCbs)) {
    emitter.addListener(listenerType, callback);
  }
};