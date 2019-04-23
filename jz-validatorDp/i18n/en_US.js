function create() {
  return {
    default: 'Validation error on field %s',
    required: '%s is required',
    enum: '%s must be one of %s',
    whitespace: '%s cannot be empty',
    date: {
      format: '%s date %s is invalid for format %s',
      parse: '%s date could not be parsed, %s is invalid ',
      invalid: '%s date %s is invalid',
    },
    types: {
      string: '%s is not a string',
      method: '%s is not a function',
      array: '%s is not an array',
      object: '%s is not an object',
      number: '%s is not a number',
      date: '%s is not a date',
      boolean: '%s is not a boolean',
      integer: '%s is not an integer',
      float: '%s is not a float',
      regexp: '%s is not a valid regexp',
      email: '%s is not a valid email',
      url: '%s is not a valid url',
      hex: '%s is not a valid hex',
    },
    string: {
      len: '%s must be exactly %s characters',
      min: '%s must be at least %s characters',
      max: '%s cannot be longer than %s characters',
      range: '%s must be between %s and %s characters',
    },
    number: {
      len: '%s must equal %s',
      min: '%s cannot be less than %s',
      max: '%s cannot be greater than %s',
      range: '%s must be between %s and %s',
    },
    array: {
      len: '%s must be exactly %s in length',
      min: '%s cannot be less than %s in length',
      max: '%s cannot be greater than %s in length',
      range: '%s must be between %s and %s in length',
    },
    pattern: {
      mismatch: '%s value %s does not match pattern %s',
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
