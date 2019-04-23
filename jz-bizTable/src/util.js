import numeral from 'numeral';

export const noop = () => {};

export const isFunction = (item) => {
  return typeof item === 'function';
};

// 非空对象
export const isEmptyObject = (data = {}) => {
  return Object.keys(data).length === 0;
};

// 格式化为数组
export const toArr = data => {
  return Array.isArray(data)
    ? data 
    : [data];
};

/**
 * Select组件的格式化：通用的props
 */
export function getSelectProps(others = {}) {
  return {
    allowClear: true,
    defaultValue: undefined,
    style: { width: '90%' },
    ...others,
  };
}

export function getSafetySelectProps(others = {}) {
  const result = {
    defaultValue: undefined,
    ...others,
  };

  if (result.mode === 'multiple') {
    const val = result.value;

    if (!Array.isArray(val)) {
      result.value = val === '' 
        ? [] 
        : [val];
    }
  }

  return result;
}

/**
 * 将数组格式化为 Select组件所需的格式
 * @param {*} list
 * @param {*} labelField
 * @param {*} valueField
 */
export function formatList4Select(list = [], labelField = 'name', valueField = 'id') {
  const result = toArr(list)
    .map(item => {
      const val = { ...item };
      if (!('label' in item)) val.label = item[labelField];
      if (!('value' in item)) val.value = item[valueField];
    });
  return result;
}

/**
 * 根据 指定 id 查找dom node，如未找到则创建并追加到body中
 * @param {string} eleId
 * @param {string} nodeType
 * @param {节点属性数组} attrs [[attrName1, attrValue1], [attrName1, attrValue1], ...]
 */
export function getElementById(eleId, nodeType, attrs = []) {
  const $ele = createEle(eleId, nodeType);

  return addEleAttrs($ele, attrs);
}

export function createEle(id, nodeType) {
  let $ele = document.querySelector(`#${id}`);

  if (!$ele) {
    $ele = document.createElement(nodeType);
    $ele.setAttribute('id', id);
    document.body.appendChild($ele);
  }

  return $ele;
}

export function addEleAttrs(domNode, attrs) {
  if (typeof attrs[0] === 'string') attrs = [attrs];

  for (const attr of attrs) domNode.setAttribute(attr[0], attr[1]);

  return domNode;
}

/**
 * 格式化【小数类】数据：整数部分用逗号分割千分位，小数点后保留两位小数
 * @param {*} value
 */
export function formatFloat(value) {
  return `${numeral(value).format('0,0.00')}`;
}

/**
 * 格式化【小数类】数据：整数部分用逗号分割千分位，小数点后保留两位小数
 * @param {*} value
 */
export function formatInteger(value) {
  return `${numeral(value).format('0,0')}`;
}

/**
 * 格式化为百分数
 * @param {*} value
 */
export function formatPercentage(value, withIndicator = true) {
  return `${numeral(value).format(withIndicator ? '0.00%' : '0.00')}`;
}

// 解析 日期时间 字符串中的日期详细信息
export function getDateDetail(data) {
  if (typeof data !== 'string') return null;

  const reg = /(\d\d\d\d)-(\d\d)-(\d\d)/;
  const result = data.match(reg);

  return result
    ? [result[1], result[2], result[3]]
    : null;
}

/**
 * @param {*} data YYYY-MM-DD HH:mm:ss
 * @param 2000-01-01
 * @return 2000-01-01
 */
export function getYMD(data) {
  const result = getDateDetail(data);
  return result ? result.join('-') : '';
}

// 解析 日期时间 字符串中的时间详细信息
export function getTimeDetail(data) {
  if (typeof data !== 'string') return null;

  const reg = /(\d\d):(\d\d):(\d\d)/;
  const result = data.match(reg);

  return result
    ? [result[1], result[2], result[3]]
    : null;
}

/**
 * @param {*} data YYYY-MM-DD HH:mm:ss
 * @param 2000-01-01 06:06:06
 * @return 06:06:06
 */
export function getTime(data) {
  const result = getTimeDetail(data);
  return result ? result.join(':') : '';
}
