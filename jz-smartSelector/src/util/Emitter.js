/**
 * 观察者
 */
function createEmitter(listeners_) {
  // 数据订阅者，Store中的数据变化时需要通知的回调
  let listeners = toArr(listeners_);

  // 注册监听
  function subscribe(listener) {
    if (typeof listener !== 'function') return;

    if (Array.isArray(listener)) {
      listeners.push(...listener);
    } else {
      listeners.push(listener);
    }

    // 取消监听
    return function unsubscribe() {
      const index = toArr(listeners)
        .indexOf(listener);

      if (index !== -1) {
        listeners.splice(index, 1, 0);
      }
    }
  }

  // 发送store状态变更通知
  function emit(event) {
    for (let $i = 0; $i < listeners.length; $i++) {
      const listener = listeners[$i];

      if (typeof listener === 'function') {
        listener(event);
      }
    }
  }  

  // 取消监听
  function reset() {
    listeners = [];
  }

  return {
    subscribe,
    emit,
    reset,
  };
}

const emitter = createEmitter();

export default emitter;
export { createEmitter };

// 格式化为数组
function toArr(data) {
  return data instanceof Array 
    ? data 
    : [data];
}
