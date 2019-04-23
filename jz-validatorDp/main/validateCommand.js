import _ from 'lodash';
import { formatErrors } from '../util';

/**
 * 用指定的 校验器实例 对 formInfo 进行校验, 并格式化输出校验解雇耦
 */
export default function validateCommand(validateHelper, formInfo, options) {
  if (_.isEmpty(validateHelper)) {
    console.log('validate instance is required!');
    return false;
  }

  let rez = true;
  validateHelper.validate(formInfo, options, result => {
    const { success, objError, listError } = formatErrors(result || []);

    if (!success && _.size(objError)) rez = objError; // console.log('validate result', result);
  });

  return rez;
}

/**
 * 批量校验一批表单(没项使用同样的校验规则 & 校验器)
 * @param {*} validateHelper
 * @param {*} formInfos
 */
export function validateBatch(validateHelper, formInfos, options) {
  if (_.isEmpty(validateHelper) || _.isEmpty(formInfos)) return false;

  const errObj = {};

  _.reduce(
    formInfos,
    (prev, formInfo, fid) => {
      const itemRez = validateCommand(validateHelper, formInfo, options);
      if (itemRez !== true) prev[fid] = itemRez;

      return errObj;
    },
    errObj
  );

  return _.isEmpty(errObj) ? true : errObj;
}

/**
 * 批量校验一批表单formInfos(没项使用同样的校验规则 & 校验器),这些formInfo中有相同的部分commonInfo,需要分别从各formInfo中抽离独立校验一次，并格式化校验结果
 * @param {*} validateHelper
 * @param {*} formInfos
 *
 * @return true: 校验通过
 * @return {
 *   commonFormInfo: { field1: { validateStatus: 'success', help: null }, field2: { validateStatus: 'success', help: null } }
 *   formInfo: { fid: { field1: { validateStatus: 'success', help: null } }, fid: { validateStatus: 'error', help: 'errorMsg' } }
 * }
 */
export function validateBatchWithCommon(validateHelper, formInfos, commonFormInfo, options_) {
  if (_.isEmpty(validateHelper) || _.isEmpty(formInfos)) return false;

  if (_.isEmpty(commonFormInfo)) return validateBatch(validateHelper, formInfos, options_);

  const options = options_ || {};

  const formInfoRez = validateBatch(validateHelper, formInfos, {
    ...options,
    excludeKeys: ['commonFormInfo'],
  });
  const commonInfoRez = validateCommand(
    validateHelper,
    { commonFormInfo },
    { ...options, keys: ['commonFormInfo'] }
  );

  return (
    (formInfoRez === true && commonInfoRez === true) || { formInfo: formInfoRez, ...commonInfoRez }
  );
}
