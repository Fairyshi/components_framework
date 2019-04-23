function create() {
  return {
    default: '格式错误%s',
    required: '%s不能为空',
    enum: '%s只能为%s之一',
    whitespace: '%s不能为空，且首尾不能为空字符串',
    date: {
      format: '%s日期%s格式错误，必须为%s',
      parse: '%s解析错误,格式必须为%s',
      invalid: '%s日期%s格式错误',
    },
    types: {
      string: '%s类型必须为字符串',
      method: '%s类型必须为(方法)',
      array: '%s类型必须为数组',
      object: '%s类型必须为对象',
      number: '%s类型必须为数字',
      date: '%s类型必须为%s格式的日期',
      boolean: '%s类型必须为布尔值',
      integer: '%s类型必须为整数',
      float: '%s类型必须为小数',
      regexp: '%s必须满足正则表达式',
      email: '%s必须为有效的邮件格式',
      url: '%s类型必须为url',
      hex: '%s类型必须为',
    },
    string: {
      len: '%s字符长度必须为%s',
      min: '%s长度不能小于%s',
      max: '%s长度不能大于%s',
      range: '%s长度必须介于%s与%s之间',
    },
    number: {
      len: '%s长度必须为%s',
      min: '%s不能小于%s',
      max: '%s不能小于%s',
      range: '%s必须介于%s与%s之间',
    },
    array: {
      len: '%s长度必须为%s',
      min: '%s长度不能小于%s',
      max: '%s长度不能大于%s',
      range: '%s长度必须介于%s与%s之间',
    },
    pattern: {
      mismatch: '%s值%s的格式错误',
    },
    clone() {
      const cloned = JSON.parse(JSON.stringify(this));
      cloned.clone = this.clone;
      return cloned;
    },
  };
}

// 全局单例
const instance = create();

export default {
  instance,
  create,
};
