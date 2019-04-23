import _ from 'lodash';
import langs from '../i18n';
import validators from './validator';

import {
  traverseMap,
  complementError,
  format,
  complementErrorsWithPath,
  formatErrors,
  toArray,
  fillTargetWithSrc,
  isExisted,
  addToArr,
} from '../util';

export default class Schema {
  /**
   * @param {*} options
   * { first: 全局串行校验(遇到错误立即结束校验并发返回该错误信息),
   *   firstFields: 串行校验的字段(对应字段校验时遇到错误立即结束校验并发返回该错误信息),
   *   error,
   *   lang: 指定国际化中的语言,
   *   langConfig: 错误提示中需要用到的 本校验器内置提示文案 以外的其他文案,
   *   cases: {
   *     case1: [ field1, field2, ... ],
   *     ...
   *   } 自定义校验模式，key-value中 value为对应模式下需要校验的数组
   * }
   */
  constructor(rules, options = {}, parents) {
    this._options = options;

    this.lang(options.lang); /* instance, create */

    this.rules = null;
    this.cases = options.cases || {};

    this.firstFields = 'firstFields' in options ? options.firstFields : true;

    // 上级的 [field] => deep(array | object)
    this.parents = parents || [];

    this.setRules(rules);
  }

  getTransform(rule = {}) {
    const type = rule.type || rule['@type@'];

    if (typeof type !== 'string') return null;

    const types = {
      number: value => (typeof value === 'string' ? (value ? Number(value) : undefined) : value),
      string: value => (typeof value === 'string' ? value : new String(value)),
    };
    if (_.isFunction(rule.transform)) {
      return rule.transform;
    }

    const transform = _.isFunction(rule.transform) ? rule.transform : types[rule.transform];

    return transform;
  }

  validate(
    dataSource_ = {},
    options_ = {
      /* messages, errors, keys, multiple, case, excludeKeys */
    },
    callback_
  ) {
    const dataSource = _.cloneDeep(dataSource_);
    let options = options_;
    let callback = callback_;

    if (_.isFunction(options_)) {
      callback = options_;
      options = {};
    }

    // 上级为 deep(array | object) 时，子级中获取 根节点上用户传入的全量 待校验数据
    if (!('dataSource_' in options)) options.dataSource_ = dataSource;
    // 指定字段的顺序取值
    options = fillTargetWithSrc(['langConfig', 'first'], options, this._options);

    if (_.isEmpty(this.rules)) {
      callback([]);
      return;
    }

    // 获取本次校验过程中的 校验错误提示信息：内置 + 用户通过参数传入
    options.messages = getValidateMessages.bind(this, options)();

    // 本次校验过程中涉及到的校验字段
    let toVldKeys = _.size(options.keys) ? options.keys : _.keys(this.rules);
    if (_.size(this.parents)) {
      // 上级为 deep(array | object) 时，如果上级在 申明的校验字段中，则其下级节点也需要添加到待校验字段数组中
      _.forEach(this.parents, parentKey => {
        if (_.includes(toVldKeys, parentKey)) toVldKeys.push(..._.keys(this.rules));
      });
    }

    // 过滤 参数中声明的 本次不被校验的 key
    if (_.size(options.excludeKeys)) {
      toVldKeys = _.filter(toVldKeys, key => !_.includes(options.excludeKeys, key));
    }

    const metaDatas = {}; // { field: [ rule1, rule2, ... ] }
    _.forEach(toVldKeys, key => {
      let value = dataSource[key];
      const rules = this.rules[key];

      if (_.isEmpty(rules)) return;

      _.forEach(rules, rule => {
        const transform = this.getTransform(rule);

        if (transform) {
          value = dataSource[key] = transform(_.cloneDeep(value));
        }

        if (_.isFunction(rule)) rule = { validator: rule };

        rule.field = key;
        rule.fullField = rule.fullField || key;
        const ruleType = (rule.type = this.getType(rule));
        rule.validator = this.getValidator(rule, ruleType);

        // 报错提示中该字段的名称
        const fieldLang = _.get(
          options,
          `langConfig.${'langField' in rule ? rule.langField : rule.fullField}`
        );
        if (fieldLang) rule.fieldLang = fieldLang;

        if (!rule.validator) return;

        metaDatas[key] = toArray(metaDatas[key]);

        const metaData = {
          field: key,
          value,
          rule,
          dataSource,
          dataSource_: options.dataSource_,
        };

        metaDatas[key].push.call(metaDatas[key], metaData);
      });
    });

    traverseMap(
      metaDatas,
      options,
      (metaData = {}, next) => {
        const { rule, value, field } = metaData;
        // 复杂类型
        const isDeep =
          ['array', 'object'].includes(rule['@type@']) &&
          (_.isPlainObject(rule.fields) || _.isPlainObject(rule.defaultField));
        const isArray = isDeep && rule['@type@'] === 'array';

        /**
         * rule中设置了跳过校验的钩子 或 options中指定了校验场景(可以映射出fullfields or fields的校验范围)
         * 且确认可跳过后不执行本次校验
         */
        if (checkBeforeInRule(rule) === false || checkInCase(rule, options, this.cases) === false) {
          return next([]);
        }

        const result = rule.validator(
          rule,
          value,
          validatorCallback.bind(this),
          dataSource,
          options
        );
        if (result && _.isFunction(result.then)) {
          result.then(() => validatorCallback([]), errors => validatorCallback(errors));
        }

        function validatorCallback(errors_ = []) {
          let errors = errors_;
          if (!_.isArray(errors_)) errors = [errors_];

          errors = complementErrorsWithPath(rule, errors);

          if (_.size(errors) && options.first) {
            return next(errors);
          }

          if (!isDeep) {
            return next(errors);
          }
          if (rule.required && !isExisted(value)) {
            if (rule.message) {
              errors = [].concat(rule.message).map(complementError.bind(null, rule));
            } else if (options.error) {
              errors = [
                options.error(
                  rule,
                  format(options.messages.required, rule.fullField || rule.field)
                ),
              ];
            } else {
              errors = errors || [];
            }
            return next(errors);
          }
          let childRules = {};
          if (rule.defaultField) {
            for (const key in value) {
              if (value.hasOwnProperty(key)) {
                childRules[key] = rule.defaultField;
              }
            }
          }

          childRules = { ...childRules, ...rule.fields };

          for (const key in childRules) {
            if (childRules.hasOwnProperty(key)) {
              const childRule = _.isArray(childRules[key]) ? childRules[key] : [childRules[key]];
              childRules[key] = _.map(childRule, addFullField.bind(null, key, rule));
            }
          }

          if (rule.options) {
            rule.options.messages = options.messages;
            rule.options.error = options.error;
          }

          const parents = addToArr(this.parents, field);
          const childValidator = new Schema(childRules, this._options, parents);

          childValidator.validate(value, rule.options || options, (errs = []) => {
            errors = errs && errs.length ? errors.concat(errs) : errs;
          });

          next(errors);
        }

        // rule中设置的用本规则量对值进行校验前的前置钩子：返回false时表示不执行本次校验
        function checkBeforeInRule(rule) {
          let result = true;

          if (_.isFunction(rule.before)) {
            const beforeProcessResult = rule.before(metaData);
            if (beforeProcessResult === false) result = false;
          }

          return result;
        }

        // 校验场景：如本规则量不在该case范围内(返回false)则不进行校验
        function checkInCase(rule = {}, options = {}, definedCases = {}) {
          let result = true;

          const optCase = options.case;
          if (optCase) {
            if (_.isString(optCase)) {
              const cases = (definedCases && definedCases[optCase]) || [];
              if (!(_.includes(cases, rule.fullField) || _.includes(cases, field))) {
                result = false;
              }
            } else if (_.isFunction(optCase)) {
              const isInCase = optCase({ ...metaData, fullField: rule.fullField });
              if (isInCase === false) result = false;
            }
          }

          return result;
        }

        // 为子级节点添加路径信息
        function addFullField(key, parentRule = {}, item) {
          const fullField = [rule.fullField || '', key].join('.');
          const rez = { ...item, fullField };

          if (isArray) rez.langField = rule.fullField;

          if (
            !('transform' in rez) &&
            parentRule &&
            parentRule['@type@'] === 'array' &&
            'transform' in parentRule
          ) {
            rez.transform = parentRule.transform;
          }

          return rez;
        }
      },
      errors => {
        callback(errors || []);
      }
    );

    function getValidateMessages(options) {
      let optMessages;
      if (_.size(options.messages)) {
        const messages_ =
          this.messages() === this.lang().instance ? this.lang().create() : this.messages();
        optMessages = { ...messages_, ...options.messages };
      } else {
        optMessages = this.messages();
      }
      return optMessages;
    }
  }

  // 内置文案的读写函数k
  lang(langName /* 指定的国际化的key */) {
    if (!langName && this.lang_) return this.lang_;

    if (!langs.hasOwnProperty(langName)) langName = 'zhCn';

    return (this.lang_ = langs[langName]);
  }

  // 解析 单条规则 的类型
  getType(rule = {}) {
    if (!(_.isPlainObject(rule) && _.size(rule))) return false;

    if (!('@type@' in rule) && rule.pattern instanceof RegExp) {
      return 'pattern';
    }

    if (
      !_.isFunction(rule.validator) &&
      (rule['@type@'] && !_.keys(validators).includes(rule['@type@']))
    )
      return false;

    return rule['@type@'] || 'string';
  }

  // 获取 单条规则的校验器 类型
  getValidator(rule, ruleType_) {
    if (_.isFunction(rule.validator)) return rule.validator;

    const ruleType = ruleType_ || this.getType(rule);
    return validators[ruleType] || null;
  }

  // 设置 case: [], 校验时只有规则量的 fullfield或field在 case指定的数组中时才会被校验
  setCase(caseType, fieldsOrFullFields = []) {
    if (caseType && fieldsOrFullFields) {
      const inner4CaseType = (this.cases[caseType] = this.cases[caseType] || []);

      const addFn = _.isArray(fieldsOrFullFields) ? 'apply' : 'call';

      inner4CaseType.push[addFn](inner4CaseType, fieldsOrFullFields);
    }
  }

  validateBatch(objDataSource = {}, options = {}) {
    /* if (options.multiple === true) {
    } */
    return this.validateBatch(dataSource, options);
  }

  // 设置规则
  setRules(rules) {
    if (_.isPlainObject(rules)) {
      this.rules = _.reduce(
        rules,
        (prev, rule, key) => {
          if (!(key in prev)) {
            prev[key] = _.isArray(rule) ? rule : [rule];
          }
          return prev;
        },
        this.rules || {}
      );
    }
  }

  // 读写 内置错误信息（国际化）
  messages(messages) {
    if (_.isEmpty(messages) && _.size(this.messages_)) return this.messages_;

    const newInstance = this.lang().create();
    this.messages_ = _.cloneDeep(newInstance, messages || {});
    return this.messages_;
  }

  // 添加内置类型以外的校验器
  static register(type, validator) {
    if (typeof type === 'string' && typeof validator === 'function') {
      validators[type] = validator;
    }
  }

  static formatErrors(errors = []) {
    return formatErrors(errors);
  }
}
