import StoreBasic from './StoreBasic';

class StorePaged extends StoreBasic {
  constructor(keyField) {
    super(keyField);

    // 当前页中对应的详细信息
    this.current = [];
  }
    
}