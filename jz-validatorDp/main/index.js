// 主体校验功能
import controller from './controller';
// 用户配置的校验规则中 type 类型指定的校验器
import validators from './validator';
// 底层的校验函数
import rules from './rule';

import validateCommand, { validateBatch, validateBatchWithCommon } from './validateCommand';

export { controller, validators, rules, validateCommand, validateBatch, validateBatchWithCommon };
