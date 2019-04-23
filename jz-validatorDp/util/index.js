import _ from 'lodash';
import { wrap2ScrollableDom } from './ui';

// 空值
export function isEmptyValue(value, type) {
  if (value === undefined || value === null) return true;

  if (type === 'array' && Array.isArray(value) && !value.length) return true;

  if (isNativeStringType(type) && typeof value === 'string' && !value) return true;

  return false;
}

// 空对象
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

export function isExisted(value) {
  return !_.isEmpty(value) || value === 0;
}

// 格式化为数组
export function toArray(item) {
  if (_.isArray(item)) return item;

  return item ? [item] : [];
}

/**
 * 将指定的值添加到数组中
 * @param {*} arr
 * @param {*} val
 */
export function addToArr(arr_ = [], val) {
  const arr = [...arr_];
  const index = arr.indexOf(val);
  if (index === -1) arr.push(val);
  return arr;
}

/**
 * 将复杂类型平铺展开为简单类型
 * @param {*} obj
 */
export function flattenObjValue2Array(obj = {}) {
  if (_.isEmpty(obj)) return [];

  const vals = _.values(obj);
  return _.flattenDeep(vals);
}

/**
 * arrField中指定的字段，如果target无对应的值&src中有，则从src中取值
 * @param {*} fields
 * @param {*} target
 * @param {*} src
 */
export function fillTargetWithSrc(fields = [], target_ = {}, src = {}) {
  const target = { ...target_ };

  fields = toArray(fields);

  _.forEach(fields, field => {
    if (!(field in target) && field in src) {
      target[field] = src[field];
    }
  });

  return target;
}

/**
 * 处理对象的每个节点，根据 options的设置处理中断配置
 * @param {*} metaDatas { field: { field, value, rule, dataSource } }
 * @param {*} options { first, fistFields }
 * @param {*} iterator 对每个节点执行的回调
 * @param {*} complete 遍历中断(自然|条件)时的回调
 */
export function traverseMap(metaDatas = {}, options = {}, iterator, complete) {
  if (options.first === true) {
    const arrMetaData = flattenObjValue2Array(metaDatas);

    traverseSerial(arrMetaData, iterator, complete);
    return;
  }

  let index = 0;
  const len = _.keys(metaDatas).length;
  const errors = [];

  function next(errs = []) {
    errors.push(...errs);

    index++;
    if (index === len) {
      complete(errors);
    }
  }

  let firstFields = options.firstFields;
  if (firstFields === true) firstFields = _.keys(metaDatas);

  const fields = _.keys(metaDatas);
  _.forEach(fields, field => {
    const rule = metaDatas[field];
    if (_.size(firstFields) && firstFields.includes(field)) {
      try {
        traverseSerial(rule, iterator, next);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        traverseParallel(rule, iterator, next);
      } catch (error) {
        console.log(error);
      }
    }
  });
}

/**
 * 用指定的遍历方法迭代，串行中断控制：遇到报错即调起结束方法callback
 * @param {*} arr
 * @param {*} iterator
 * @param {*} callback
 */
export function traverseSerial(arr = [], iterator, callback) {
  const len = _.size(arr);
  let index = 0;
  let rez = null;

  const next = (errors = []) => {
    if (_.size(errors)) {
      rez = errors;
      callback(errors);
      return;
    }

    try {
      if (index < len) {
        iterator(arr[index++], next);
      }
    } catch (error) {
      console.log(error);
    }

    if (index === len && !rez) {
      callback([]);
    }
  };

  next([]);
}

/**
 * 用指定的遍历方法迭代，并行中断控制：遍历并汇总所有的迭代结果后调起结束方法callback
 * @param {*} arr
 * @param {*} iterator
 * @param {*} callback
 */
export function traverseParallel(arr = [], iterator, callback) {
  const len = _.size(arr);
  let index = 0;
  const errors = [];

  const accumulate = (errs = []) => {
    errors.push(...errs);

    index++;
    if (index === len) {
      callback(errors);
    }
  };

  _.forEach(arr, item => {
    try {
      iterator(item, accumulate);
    } catch (error) {
      console.log(error);
    }
  });
}

/**
 * 基于rule，格式化错误(string | object)提示为 错误串&错误路径节点
 * @param {*} rule
 * @param {*} oe
 */
export function complementError(rule, err) {
  let rez = err;

  if (err && err.message) {
    rez.field = err.field || rule.fullField;
  } else {
    rez = {
      message: err,
      field: err.field || rule.fullField,
    };
  }
  if (!_.get(rez, 'message.props.htmlFor')) {
    rez.message = wrap2ScrollableDom(rez.message, rule.fullField);
  }

  return rez;
}

/**
 * 格式化报错信息
 * @param {*} rule
 * @param {*} errs
 */
export function complementErrorsWithPath(rule = {}, errs = []) {
  const errors = _.flattenDeep(errs);

  if (_.isEmpty(errors)) return [];

  return _.map(errors, complementError.bind(null, rule));
}

/**
 * 优先从rule的message中获取错误提示，如果没有则用模版中的通配符替换的结果
 * @param {*} rule
 * @param {*} template
 */
export function getErrorMessageFromRuleOrTemplate(rule = {}, template, ...others) {
  let message = rule.message;

  if (message === undefined) {
    let fieldName = rule.fieldLang;
    if (_.isPlainObject(fieldName)) {
      const strFieldName = fieldName[rule.field];
      fieldName = strFieldName || fieldName;
    }
    if (!fieldName || !_.isString(fieldName)) {
      fieldName = rule.fullField;
    }
    message = format(template, fieldName, ...others);
  }

  return message;
}

/**
 * 格式化输出校验的汇总信息
 * success {boolean} 校验是否成功
 * listError {[string]} 校验提示数组
 * objError 支持antd的报错样式的 错误对象(支持深层嵌套的复杂对象),叶子节点为antd的报错格式
 * { validateStatus: 'success | error', help: 'error message' }
 */
export function formatErrors(errors_ = []) {
  const errors = _.flattenDeep(errors_);

  let success = true;
  const listError = [];
  const objError = {};
  console.log('----formatErrors-----');
  console.log(errors);
  if (_.size(errors)) {
    const objErrorPathMessage = {};
    _.forEach(errors, error => {
      const { message, field } = error || {};
      if (message && field) {
        if (success) success = false;

        listError.push.call(listError, message);

        objErrorPathMessage[field] = message;
      }
    });

    _.reduce(
      objErrorPathMessage,
      (prev, message, field) => {
        // antd 的错误样式格式
        const errorInfo = { validateStatus: 'error', help: message };
        insertByPath(prev, field, errorInfo);

        return prev;
      },
      objError
    );
  }

  return { success, listError, objError };
}

/**
 * 将格式化的错误信息根据指定的path插入到target中
 * @param {*} target
 * @param {*} path
 * @param {*} errorInfo
 */
function insertByPath(target = {}, path, errorInfo) {
  const arrPath = castPath(path);
  const len = arrPath.length;

  let tgt = target;

  if (len === 1) {
    target[path] = errorInfo;
  } else {
    let index = 0;

    while (index < len) {
      if (!tgt[arrPath[index]]) tgt[arrPath[index]] = {};

      tgt = tgt[arrPath[index]];

      index++;
    }

    // 将错误信息全量写入指定路径的叶子节点中
    _.keys(errorInfo).forEach(key => {
      tgt[key] = errorInfo[key];
    });
  }
}

// 将路径格式化为数组（用'.'分割）
function castPath(path) {
  if (path == undefined || path === null) return [];

  if (_.isArray(path)) return path;

  return `${path}`.split('.');
}

/**
 * 指定的 item值是否是 表单校验结果
 * @param {*} item
 */
export function isValidateResult(item) {
  if (!item) item = {};

  return (
    'help' in item &&
    'validateStatus' in item &&
    _.includes(['success', 'error'], item.validateStatus)
  );
}

// 判断校验输出的结果是否为 错误类
export function isErrorResult(result = {}) {
  return _.get(result, 'validateStatus') === 'error';
}

/**
 * 多字段的校验结果：并非全部校验成功
 * @param {*} validateResut4Fields
 */
export function hasError(validateResut4Fields = {}) {
  return _.values(validateResut4Fields).some(fieldValidateResult =>
    isErrorResult(fieldValidateResult)
  );
}

/**
 * errors = {
 *   key1: { help: ''},
 *   key2: {
 *     key20: { help: ''},
 *   },
 *   key3: [
 *     { key30: { help: ''} },
 *     { key31: { help: ''} },
 *   ]
 * }
 * @param {*} errors
 */
export function flatComplicatedErrors(errors = {}) {
  const result = {};

  const loop = (obj = {}, parentKey = '') => {
    _.keys(obj).forEach(key => {
      const item = obj[key];

      const path = isExisted(parentKey) ? [parentKey, key].join('.') : key;
      if (item === true || isValidateResult(item)) {
        result[path] = item;
      } else if (_.isPlainObject(item) && _.size(item)) {
        loop(item, path);
      }
    });
  };

  loop(errors);

  return result;
}

/**
 * 将校验结果中的报错信息平铺为 { path: erroInfo } 的形式
 * @param {*} errors
 * @param {*} needFlat
 */
export function filter4ErrorItems(errors = {}, needFlat = false) {
  const flattenErrors = needFlat ? flatComplicatedErrors(errors) : errors;

  return _.reduce(
    flattenErrors,
    (prev, item, key) => {
      if (isErrorResult(item)) {
        prev[key] = item;

        return prev;
      }

      return prev;
    },
    {}
  );
}

const formatRegExp = /%[sdj%]/g;
export function format(...args) {
  let i = 1;
  const f = args[0];
  const len = args.length;
  if (typeof f === 'function') {
    return f(...args.slice(1));
  }
  if (typeof f === 'string') {
    let str = String(f).replace(formatRegExp, x => {
      if (x === '%%') {
        return '%';
      }
      if (i >= len) {
        return x;
      }
      switch (x) {
        case '%s':
          return String(args[i++]);
        case '%d':
          return Number(args[i++]);
        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }
          break;
        default:
          return x;
      }
    });
    for (let arg = args[i]; i < len; arg = args[++i]) {
      str += ` ${arg}`;
    }
    return str;
  }
  return f;
}

// string 的子类型
function isNativeStringType(type) {
  return (
    type === 'string' || type === 'url' || type === 'hex' || type === 'email' || type === 'pattern'
  );
}

export function isNoparse(mode) {
  return _.includes(['show'], mode);
}
