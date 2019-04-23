import { isErrorResult } from './index';

/**
 * 将 fieldKey 通过 (html)for 关联的dom 滚动到可视区
 * @param {*} fieldKey
 */
export function scrollToField(fieldKey) {
  const labelNode = getFieldKeyDom(fieldKey);

  if (labelNode) labelNode.scrollIntoView(true);
}

/**
 * 将指定的文本转化为用 (html)for 包装的 dom
 * @param {*} domText
 * @param {*} fieldKey
 */
export function wrap2ScrollableDom(domText, fieldKey) {
  if (!domText && domText !== 0) return null;

  return <span htmlFor={fieldKey}>{domText}</span>;
}

/**
 * 获取通过 (html)for 关联的dom
 * @param {*} fieldKey
 */
export function getFieldKeyDom(fieldKey) {
  return document.querySelector(`span[for="${fieldKey}"]`);
}

/**
 * 批量转化为用 (html)for 关联的dom
 * @param {*} errors
 */
export function wrap2ScrollableDoms(errors) {
  const scrollDomErrors = _.reduce(
    errors,
    (prev, item, fieldKey) => {
      if (isErrorResult(item)) {
        prev[fieldKey] = wrap2ScrollableDom(item.help, fieldKey);
      }
      return prev;
    },
    {}
  );
  return scrollDomErrors;
}

/**
 * 解析出全局报错信息详情面板中的 错误项的错误提示
 * @param {*} data
 */
export function parse4Help(data = {}, showMode = false) {
  if ((showMode && typeof data === 'string' && data) || (typeof data === 'string' && !data))
    return data;

  let help = data.help;

  if (_.isPlainObject(help)) {
    const helpText = _.get(data, 'help.props.children');

    if (helpText) {
      help = _.isString(helpText) ? helpText : _.get(helpText, 'props.children');
    }
  }

  return help;
}

/**
 * 判断 tgtClass 是否在 dom 的class中
 * @param {*} dom
 * @param {*} tgtClass
 */
export function isInDomClass(dom, tgtClass) {
  const tgtClx = dom.classList.value;
  return tgtClx.includes(tgtClass);
}
