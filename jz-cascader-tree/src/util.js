export const noop = () => {};

export const isFunction = (item) => {
  return typeof item === 'function';
};

// 是否为对象类
export const isObject = item => {
  return item != null 
    && typeof item === 'object' 
    && Array.isArray(item) === false;
};

// 指定值是否在数组中
export const isInArr = (val, arr = []) => {
  return toArr(arr)
    .indexOf(val) !== -1;
}

// 有效值
export const isEmpty = (val) => {
  return !val || val === 0;
}

// key是否为对象的键
export const isKey = (key, obj) => {
  return typeof obj === 'object' 
    && obj.hasOwnProperty(key);
}

// 从数组中删除
export const toDel = (val, arr = []) => {
  return toArr(arr)
    .filter(item => item !== val);
}

// 节点的描述
export const getItemDesc = item => {
  return item.label || item.name || item.id;
};

// 节点值
export const getItemVal = item => {
  return item.value || item.id;
};

// 类数组
export const isArrLike = data => {
  return data instanceof Array;
}

// 非空对象
export const isEmptyObject = (data = {}) => {
  return Object.keys(data).length === 0;
};

// 非空数组
export const isEmptyArr = (data) => {
  return data instanceof Array 
    && data.length > 0;
}

// 格式化为数组
export const toArr = data => {
  return isArrLike(data) ? data : [data];
};

// 格式化为字符串
export const toStr = data => {
  return typeof data === 'string' 
    ? data 
    : `${data}`;
}

// 位置转为数组
export const posToArr = (pos, splitIndicator = '-') => {
  return toStr(pos).split(splitIndicator);
}

// 数组转为位置
export const arrToPos = (arr, splitIndicator = '-') => {
  return toArr(arr).join(splitIndicator);
}

export const stringify = (data) => {
  if (typeof data === 'string') return data;

  try {
    return JSON.stringify(data);
  } catch(e) {
    console.log(e);
    return data;
  }
}

// 对象内容深比较
export const isContentEqual = (src, tgt) => {
  const srcStr = stringify(
    src instanceof Array 
      ? src.sort() 
      : src
    );
  const tgtStr = stringify(
    tgt instanceof Array 
      ? tgt.sort() 
      : tgt
    );

  return srcStr === tgtStr;
};

/**
 * 格式化树对象
 * @param {array} data 原始树数据
 * @return {object} { metaData, keyEntities, posEntities } 
 * @return {array} 
 * { key, pos, level, index, node, isLeaf, parentPos }
 * metaData [ ================= ********** ===================
 *   {
 *     key: '', // 节点标记
 *     pos: '', // 在树中的位置
 *     level: '', // 再树中的第几层
 *     index: '', // 在当前层中的位置
 *     node: {},
 *     isLeaf: boolean, // 是否叶子节点
 *     parentPos: '', 
 *   },
 * ]
 * 
 * keyEntities: { key1: {...metaItem}, ... }
 * posEntities: { pos1: {...metaItem}, ... }
 */
export const getTreeMetaInfo = (data) => {
  const metaList = [];
  const keyEntities = {};
  const posEntities = {};

  if (data.length) {
    traverseTree(data, (metaItem, parent) => {
      if (metaItem && metaItem.key) {
        keyEntities[metaItem.key] = metaItem;
        posEntities[metaItem.pos] = metaItem;
    
        if (!parent) {
          metaList.push(metaItem);
        } else {
          const parentItem = posEntities[parent.pos];
    
          if (!('children' in parentItem)) parentItem.children = [];
    
          parentItem.children.push(metaItem);
        }
      }
    });
  }

  return {
    metaList,
    keyEntities,
    posEntities,
  };
};

// 根据节点的位置获取其层级(从0计数)
export function getLevel(pos) {
  return posToArr(pos).length - 1;
}

/**
 * 遍历树中的所有节点，逐一调用 iteratorCb
 * @param {array} treeData 树
 * @param {*} iteratorCb 对每个节点调用的回调
 */
export const traverseTree = (treeData = [], iteratorCb) => {
  if (typeof iteratorCb !== "function") {
    return treeData;
  }

  const loop = (arr = [], parent = null) => {
    toArr(arr).forEach((item, index) => {
      const pos = arrToPos(
        parent 
          ? [parent.pos, index] 
          : index
        );
      const metaItem = {
        pos,
        index,
        level: getLevel(pos),
        node: item,
        parentPos: (parent && parent.pos) || '',
        isLeaf: !('children' in item),
      };
      metaItem.key = getIdentity(item) || metaItem.pos;

      iteratorCb.call(null, metaItem, parent);

      if ('children' in item) {
        loop(item.children, { ...metaItem });
      }
    });
  };

  return loop(treeData);
}

// item的唯一标记
export function getIdentity(item) {
  return 'key' in item 
    ? item.key 
    : (
      'id' in item 
        ? item.id 
        : item.value
    )
}

// todo 添加disabled keys的逻辑
export function calcCheckedKeys(keys, data = {}, props) {
  if (props.checkable === false || !keys) return;

  const { keyEntities = {}, posEntities = {} } = data;

  const tgtCheckedKeys = {};
  const tgtHalfCheckedKeys = {};

  // 处理前驱节点
  function conductUp(key, halfChecked) {
    if (tgtCheckedKeys[key]) return;

    const { children = [], parentPos } = keyEntities[key];
    const isAllChecked = !halfChecked 
      && children.every(child => child.key in tgtCheckedKeys);

    if (isAllChecked) {
      tgtCheckedKeys[key] = true;
    } else {
      tgtHalfCheckedKeys[key] = true;
    }

    if (parentPos) {
      conductUp(posEntities[parentPos].key, !isAllChecked);
    }
  }

  // 处理子树中的节点
  function conductDown(key) {
    if (!(key in keyEntities)) return;

    tgtCheckedKeys[key] = true;

    const { children = [] } = keyEntities[key];
    children.forEach( child => {
      conductDown(child.key);
    });
  }

  // 处理当前节点
  function conductNode(key) {
    if (!(key in keyEntities)) return;

    tgtCheckedKeys[key] = true;

    const { children = [] } = keyEntities[key];
    children.forEach(child => {
      conductDown(child.key);
    });

    const parentPos = keyEntities[key].parentPos;
    if (parentPos != null) {
      const parentNode = posEntities[parentPos];
      if (parentNode) {
        conductUp(parentNode.key);
      }
    }
  }

  keys.forEach(key => {
    conductNode(key);
  });

  return {
    checkedKeys: Object.keys(tgtCheckedKeys),
    halfCheckedKeys: Object.keys(tgtHalfCheckedKeys)
      .filter(key => !tgtCheckedKeys[key]),
  };
}

// 根据props的值及指定的key，计算出最终生成的选择值
export function calcSelectedKeys(keys, data, props) {
  if (!keys) return undefined;

  const { multiple } = props;
  if (multiple) return keys.slice();

  if (keys.length) return keys[0];
  return keys;
}

/**
 * 根据指定的展开的expandedKeys，获取需要展开的pos
 * @param {array or string} expandedKeys 展开的key数组
 * @param {boolean} expandedKeys 自动展开标记：为true 时，如果expandedKeys为空，则默认取metaData中的第一个item的pos作为展开的pos
 * @param {object} metaData 
 */
export function getCurrentPos(expandedKeys, autoExpand, metaData = {}, deep) {
  const arrKeys = toArr(expandedKeys);

  if (isEmptyArr(arrKeys) && !autoExpand) return '';

  const { keyEntities = {}, metaList = [] } = metaData;
  if (isEmptyObject(keyEntities)) return '';

  const firstExpandedKey = expandedKeys[0];
  if (!isEmpty(firstExpandedKey)) {
    const item = keyEntities[firstExpandedKey];
    if (item) return item.pos;
  }

  let pos = '';
  if (autoExpand === true) {
    pos = (metaList[0] || {}).pos;
  } else if (autoExpand === 'first' && deep) {
    pos = [];
    for(let $i = 0; $i < deep; $i++) pos.push('0');
    pos = pos.join('-');
  }

  return pos;
}

/**
 * 将指定key数组中的有效项提出
 * @param {*} keys 
 * @param {*} metaData 
 */
export function filterKeys (keys = [], metaData = {}) {
  const { keyEntities = [] } = metaData;

  return keys.filter(key => key in keyEntities);
}

export function lastInArr(arr_ = []) {
  const arr = toArr(arr_);
  return arr[arr.length -1];
}

// 合并多个数组
export function mergeArrs() {
  const obj = {};

  let i;
  for (i = 0; i < arguments.length; i++) {
    const arr = arguments[i];

    if (Array.isArray(arr)) {
      arr.forEach(key => {
        obj[key] = key;
      });
    } else {
      obj[arr] = arr;
    }
  }

  return Object.keys(obj);
}

/**
 * 找出选中的节点(value)中在树中深度最大的
 * @param {array} value 相关节点的key数组
 * @param {array} expandedKeys 展开的key数组
 * @param {array} data 树数据
 */
export function getMaxDeep(value = [], selectedKeys = [], currentPos = '', metaData = {}) {
  const { keyEntities = [] } = metaData;
  const arrPos = mergeArrs(value, selectedKeys)
    .map(key => keyEntities[key].pos);

  if (currentPos && arrPos.indexOf(currentPos) === -1) {
    arrPos.push(currentPos);
  }

  const arrPosLength = arrPos
    .map(pos => pos.split('-').length)
    .sort();
  const maxDeep = lastInArr(arrPosLength) || 0;
  return maxDeep + 1;
}

/**
 * 根据所激活的节点在树中的位置，将路径中关联的节点展示在树列框中
 * @param {*} level 树层级
 * @param {*} currentPos 激活的节点在树中的位置
 * @param {*} data 树数据
 */
export function getGroupData(level, currentPos = '', data = {}) {
  const maxLevel = posToArr(currentPos).length;
  if (level > maxLevel) return [];
  const ancestorPos = getAncestorPos(currentPos, level - 1);
  
  if (ancestorPos === false) return [];

  if (ancestorPos === "") {
    return getMetaDataByDeep(data);
  }

  const { keys, childrenMetaData } = getDirectChildren(ancestorPos, data);
  return childrenMetaData;
}

// 获取指定深度的节点metaData
export function getMetaDataByDeep(metaData = {}, deep = 1) {
  const { posEntities = {} } = metaData;

  if (isEmptyObject(posEntities)) return [];

  const rez = Object
    .keys(posEntities)
    .reduce((prev, pos) => {
      const nodeDeep = pos.split('-').length;

      if (nodeDeep === deep) prev.push(posEntities[pos]);

      return prev;
    }, []);
    return rez;
}

/**
 * 获取指定层级的祖先节点位置
 * @param {*} pos 
 * @param {*} level 
 */
export function getAncestorPos(pos, level) {
  if (level === -1) return '';

  const path = posToArr(pos);

  if (level >= path.length) return false;

  const arr = [];
  for (let i = 0; i <= level; i += 1) arr.push(path[i]);

  return arrToPos(arr);
}

/**
 * 获取指定位置节点的直接子节点
 * @param {*} parentPos 
 * @param {*} data 
 */
export function getDirectChildren(parentPos = '', metaData = {}) {
  const { metaList = [], posEntities = {} } = metaData;
  const keys = [];
  const childrenMetaData = [];

  Object
    .keys(posEntities)
    .forEach(pos => {
      if (isDirectChild(parentPos, pos)) {
        const item = posEntities[pos];

        childrenMetaData.push(item);
        keys.push(item.key);
      }
    });
  return { keys, childrenMetaData };
}

// 根据两个节点在树中的位置判断是否为直接的父子(非祖先子孙)关系
export function isDirectChild(parentPos = '', childPos = '') {
  if (!childPos || parentPos.length > childPos.length) return false;

  const parentPath = posToArr(parentPos);
  const childPath = posToArr(childPos);

  if (parentPath.length === 0 && childPath.length === 1) return true;

  if (parentPath.length + 1 !== childPath.length) return false;

  const len = parentPath.length;
  for (let i = 0; i < len; i += 1) {
    if (parentPath[i] !== childPath[i]) return false;
  }

  return true;
}

/**
 * 获取目标节点(pos)的上游节点
 * @param {*} pos 
 * @param {*} data 
 */
export function getKeysByPos(tgtPos, metaData = {}) {
  const { posEntities } = metaData;

  const keys = Object
    .keys(posEntities)
    .filter(pos => (isParent(pos, tgtPos) || pos === tgtPos))
    .map(pos => posEntities[pos].key);
  
  return keys;
}

/**
 * 是否是父节点
 * @param {string} parentPos 父节点
 * @param {string} childPos 子节点
 * @param {bool} directly 直接父节点而非祖先节点
 */
export function isParent(parentPos, childPos, directly = false) {
  if (
    !parentPos 
    || !childPos 
    || parentPos.length >= childPos.length
  ) return false;

  const parentPath = posToArr(parentPos);
  const childPath = posToArr(childPos);

  // Directly check
  if (
    directly 
    && parentPath.length !== childPath.length - 1
  ) return false;

  const len = parentPath.length;
  for (let i = 0; i < len; i += 1) {
    if (parentPath[i] !== childPath[i]) return false;
  }

  return true;
}

// 根据key获取相应的pos
export function getPosByKey(keyEntities = {}, key) {
  return (keyEntities[key] || {}).pos;
}

export function getKeyByPos(posEntities = {}, pos) {
  return (posEntities[pos] || {}).key;
}

// 字符串数组，根据字符串的长度排序
export function sortArrByLength(a, b) {
  return toStr(a).length - toStr(b).length;
}

/**
 * 剔除key中冗余的项，过滤规则：
 *   如果父节点选中，则其中的所有子节点均会被过滤掉
 */
export function getNoRedundent(checkedKeys = [], metaData = {}) {
  const { posEntities = {}, keyEntities = {} } = metaData;

  if (
    isEmptyObject(posEntities) 
      || isEmptyObject(keyEntities)
  ) return checkedKeys;

  const checkedPoss = toArr(checkedKeys)
    .map(getPosByKey.bind(null, keyEntities))
    .sort(sortArrByLength);

  const filteredPoss = {};
  checkedPoss.forEach(pos => {
    if (
      checkedPoss.every(onePos => !isParent(onePos, pos))
    ) {
      filteredPoss[pos] = true;
    }
  });

  const filteredKeys = Object
    .keys(filteredPoss)
    .map(getKeyByPos.bind(null, posEntities));

  return filteredKeys;
}
