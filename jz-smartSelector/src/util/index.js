import emitter, { createEmitter } from './Emitter';
export * from './constant';

export const noop = () => {};

// 是否为方法
export const isFunction = (item) => {
  return typeof item === 'function';
};

export const toNumber = (data) => {
  if (Array.isArray(data)) {
    return data.map(data => Number(data))
  }

  return Number(data);
};

// 是否为对象类
export const isObject = item => {
  return item != null 
    && typeof item === 'object' 
    && Array.isArray(item) === false;
};

export const isEmptyArray = data => {
  return Array.isArray(data) 
    && data.length === 0;
};

// 类数组
export const isArrLike = data => {
  return data instanceof Array;
}

// 格式化为数组
export const toArr = data => {
  return isArrLike(data) ? data : [data];
};

export const find = (data, item, keyField = 'fid') => {
  let rez;
  toArr(data)
    .forEach(child => {
      if (child[keyField] === item[keyField]) {
        rez = child;
      }
    });
  return rez || null;
};

export const stringify = (data) => {
  if (typeof data === 'string') return data;

  try {
    return JSON.stringify(data);
  } catch(e) {
    console.log(e);
    return data;
  }
}

// 对象内容深比较
export const isContentEqual = (src, tgt) => {
  const srcStr = stringify(
    src instanceof Array 
      ? src.sort() 
      : src
    );
  const tgtStr = stringify(
    tgt instanceof Array 
      ? tgt.sort() 
      : tgt
    );

  return srcStr === tgtStr;
};

/**
 * 源中是否有 部分|全部位于目标中
 * @param {} src 
 * @param {*} target 
 * @param {*} compareFn  'every' | 'some'
 */
export const isContainedOrAll = (src = [], target = [], compareFn = 'every') => {
  if (
    !['every', 'some'].includes(compareFn)
  ) {
    console.log('compareFn value should be one of [every, some]');
    return false;
  }

  const arrSrc = toArr(src);
  const arrTgt = toArr(target);

  if (
    compareFn === 'every' 
      && arrSrc.length > arrTgt
  ) return false;

  return arrSrc[compareFn](val => arrTgt.includes(val));
};

/**
 * 从列表中获取指定字段的值
 * @param {*} data 
 * @param {*} keyField 
 */
export const extractField = (data, keyField = 'fid', toFilterInvalid) => {
  const value = toArr(data)
    .map(item => item[keyField]);

  return toFilterInvalid
    ? value.filter(Boolean)
    : value;
};

// 节点值
export const getItemVal = item => {
  return item.value || item.id || item.key;
};

// 节点的描述
export const getItemDesc = item => {
  return item.label || item.name || getItemVal(item);
};

export const preventDefault = (event) => {
  if (event && isFunction(event.preventDefault)) {
    event.preventDefault();
  }
}

export const stopPropagation = (event) => {
  event.stopPropagation();

  if (event.nativeEvent.stopImmediatePropagation) {
    event.nativeEvent.stopImmediatePropagation();
  }
}

export { emitter, createEmitter };
