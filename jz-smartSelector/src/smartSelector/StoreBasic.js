import { 
  emitter, 
  DEFAULT_KEY_FIELD,
  toArr,
  isContainedOrAll,
  extractField,
  isFunction,
  find,
  isObject,
  toNumber
} from '../util';

// 选中状态存储的
export default class StoreBasic {
  constructor(keyField, option) {
    // 主键key default 'fid'）;
    this.keyField = keyField || DEFAULT_KEY_FIELD;

    this.emitter = emitter;

    // 私有，数据汇总存储 { [keyField]: { item } }
    this.cache = {};
    // 选中的值 ['fid1', 'fid2', ...]
    this.value = [];
    // value对应的详细信息
    this.data = [];

    this.isNumber = false;
    if (
      isObject(option) 
        && option.isNumber !== false/* value中的值需要转为数字 */) {
      this.isNumber = true;
    }
  }
  
  // 所有可选项均选中
  isAllSelected = (compareByData = true/*用data作为全集而非cache中值*/) => {
    return this.getSelectedStatus('every', compareByData);
  };  
        
  // 有选中项
  isAnySelected = (compareByData = true/*用data作为全集而非cache中值*/) => {
    return this.getSelectedStatus('some', compareByData);
  }; 

  // 是否 全部|部分选中
  getSelectedStatus = (compareFn_ = 'every', compareByData_ = true/*用data作为全集而非cache中值*/) => {
    const compareFn = compareFn_ !== 'some'
      ? 'every'
      : 'some';
    
    const value = this.get();
    const compareByData = compareByData_ !== undefined 
      ? compareByData_
      : (
        typeof compareFn_ === 'boolean' 
          ? compareFn_
          : true
      );
    const availableValue = this.getAllKeys(compareByData);

    return isContainedOrAll(availableValue, value, compareFn);
  };

  // 所有选择的 keyField数据
  get = () => {
    const arrVal = toArr(this.value);

    return !this.isNumber
      ? arrVal
      : toNumber(arrVal);
  }; 
  
  // 替换设置内部值value、data
  set = (keyFields_ = [], items_) => {
    this.select(keyFields_, items_, true);
  };

  // 所有选择的 keyField数组对应的详情列表
  getValueDetail = () => {
    return this.get()
      .map(val => this.cache[val])
      .filter(Boolean);
  };

  // 获取结构化的信息 { value, data, isAllSelected, isAnySelected }
  getMetaInfo = (compareByData) => {
    const value = this.get();
    const data = this.getValueDetail();

    return { 
      value,
      data, /*选中项对应的内容*/
      currentData: this.data, /*当前页中所有的内容（包括选中项、未选中项）*/
      isAllSelected: this.isAllSelected(compareByData),
      isAnySelected: this.isAnySelected(),
      cache: this.cache
    };
  };

  // 设置选中值，并存储相应的数据
  select = (keyFields_ = [], items_, replace = false/*false: 添加；true: 覆盖*/) => {
    let keyFields = toArr(keyFields_);
    if (this.isNumber) keyFields = toNumber(keyFields);
    
    if (replace) {
      this.updateAndEmit(keyFields, items_);
      return;
    } 

    const items = toArr(items_);
    const value = this.get().slice();
    const data = toArr(this.data).slice();

    keyFields.forEach(keyField => {
      if (!value.includes(keyField)) {
        value.push(keyField);
      }
    });

    const { keyField } = this;
    items.forEach(item => {
      const key = item[keyField];
      let index;

      data
        .forEach((oneItem, index_) => {
          if (oneItem[keyField] === key) {
            index = index_;
          }
        });

      if (index !== undefined) {
        data[index] = item;
      } else {
        data.push(item);
      }
    });

    this.updateAndEmit(value, data);
  }; 

  // 切换指定项在 store中的选中状态
  toggle = (item = {}) => {
    const keyField = item[this.keyField];
    
    if (keyField !== undefined) {
      if (Array.isArray(keyField)) {
        this.set(keyField, item, true);
        return;
      }
      
      const { value: value_, currentData: data_ } = this.getMetaInfo();

      const index = value_.indexOf(keyField);
      let value;
      let data;

      if (index !== -1) {
        value = [...value_];
        value.splice(index, 1);
      } else {
        value = [...value_, keyField];
        
        const isItemInCurrentData = find(data_, item, this.keyField);
        if (!isItemInCurrentData) {
          data = [...data_, item];
        }
      }

      this.set(value, data);
    } 
  };

  updateAndEmit = (value_, data, toarr = false) => {
    const value = toArr(value_);

    this.value = value;

    if (data !== undefined) {
      this.data = data;
    }

    if (Array.isArray(data)) {
      data
        .filter(Boolean)
        .forEach(item => {
          const key = item[this.keyField];
          if (!(key in this.cache)) {
            this.cache[key] = item;
          }
        });
    }

    this.emit({ value, data: this.data });
  };

  // 选中所有值，参数为 false时为取消选中所有
  selectAll = (selectByData_ = true/*用data作为全集而非cache中值*/, toFilterInvalid = true) => {
    const isAllChecked = this.isAllSelected(selectByData_);

    if (isAllChecked) {
      this.set();
      return;
    }

    const data = this.getAllKeySource(selectByData_, toFilterInvalid);
    const value = extractField(data, this.keyField, toFilterInvalid);

    this.set(value, data);
  };         

  // 清除所有数据及状态         
  clear = () => {
    this.cache = {};
    // 重置 value & data
    this.updateAndEmit();
  };  

  // 添加订阅者
  subscribe = (...params) => {
    this.emitterProxy('subscribe', ...params);
  };

  // 内部状态变化时通知所有订阅者
  emit = (...params) => {
    this.emitterProxy('emit', ...params);
  };
  
  // 内容变更时
  emitterProxy = (fn, ...params) => {
    if (
      this.emitter 
        && isFunction(this.emitter[fn])
    ) {
      this.emitter[fn](...params);
    }
  };

  // 获取所有可选项的数据详情(从data or cache取)
  getAllKeySource = (useData = true, toFilterInvalid = true) => {
    const { keyField } = this;
    const source = toArr(
      useData
        ? this.data
        : Object.values(this.cache)
      )
      .filter(Boolean);

    return toFilterInvalid
      ? source.filter(Boolean)
      : source;
  };

    // 获取所有可选项的数据key(从data or cache取)
    getAllKeys = (useData = true, toFilterInvalid = true) => {
      return toArr(
        this.getAllKeySource(useData, toFilterInvalid)
      ).map(
        item => item[this.keyField]
      ).filter(Boolean);
    };
}
