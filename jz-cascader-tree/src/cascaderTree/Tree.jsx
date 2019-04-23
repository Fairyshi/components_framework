import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { 
  isFunction,
  getCurrentPos,
  calcCheckedKeys,
  calcSelectedKeys,
  isContentEqual,
  isEmptyObject,
  isEmptyArr,
  filterKeys,
  getMaxDeep,
  isInArr,
  getGroupData,
  getKeysByPos,
  getNoRedundent,
} from '../util';

import TreeItem from './TreeItem';
import { CascaderGroups } from '../ui';

/**
 * @component 级联树
 */
export default class CascaderTree extends PureComponent {
  static propTypes = {
    prefixClx: PropTypes.string,
    className: PropTypes.string,
    readOnly: PropTypes.bool,
    style: PropTypes.object,
    data: PropTypes.shape({
      metaList: PropTypes.array,
      keyEntities: PropTypes.object, 
      posEntities: PropTypes.object, 
    }),
    multiple: PropTypes.bool,
    selectable: PropTypes.bool,
    checkable: PropTypes.bool,
    autoExpand: PropTypes.bool,
    deep: PropTypes.number,
    maxDeep: PropTypes.number,
    checkedKeys: PropTypes.arrayOf(PropTypes.string),
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    expandedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    checkDisabledPoss: PropTypes.arrayOf(PropTypes.string),
    checkDisabledKeys: PropTypes.arrayOf(PropTypes.string),
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    onExpand: PropTypes.func,
    renderTreeNode: PropTypes.func,
  };

  static defaultProps = {
    prefixClx: 'cascadetree',
    className: '',
    readOnly: false,
    style: {},
    data: {
      metaList: [],
      keyEntities: {}, 
      posEntities: {},
    },
    multiple: true,
    selectable: true,
    checkable: true,
    autoExpand: true,
    deep: 3,
    maxDeep: 3,
    checkedKeys: [],
    selectedKeys: [],
    expandedKeys: [],
    defaultSelectedKeys: [],
    defaultExpandedKeys: [],
    checkDisabledPoss: [],
    checkDisabledKeys: [],
    onSelect: undefined,
    onChange: undefined,
    onExpand: undefined,
    renderTreeNode: undefined,
  };
  
  // 树节点的 meta中解析出pos
  static getNodePos = (treeNode) => {
    const { data } = treeNode.props || treeNode;

    return (data || {}).pos;
  }

  constructor(props) {
    super(props);

    const {
      defaultCheckedKeys,
      defaultSelectedKeys,
      defaultExpandedKeys,
      autoExpand,
      data,
      deep,
    } = props;
    const { 
      checkedKeys = [], 
      halfCheckedKeys = [] 
    } = calcCheckedKeys(
      props.checkedKeys || defaultCheckedKeys,
      data, 
      props
    );
    const selectedKeys = calcSelectedKeys(
      props.selectedKeys || defaultSelectedKeys, 
      data, 
      props
    );

    // 初始化时指定了需要展开的key时，设置默认的currentPos
    const currentPos = getCurrentPos(
      defaultExpandedKeys, 
      autoExpand, 
      data, 
      deep
    );

    this.state = {
      data,
      checkedKeys: filterKeys(checkedKeys, data),
      halfCheckedKeys: filterKeys(halfCheckedKeys, data),
      selectedKeys: filterKeys(selectedKeys, data),
      // 当前选中的路径
      currentPos,
    };

    this.checkedBatch = null;
  }

  componentWillReceiveProps(nextProps) {
    const state = {};
    if (
      'data' in nextProps && 
      !isContentEqual(nextProps.data, this.state.data)
    ) {
      state.data = nextProps.data;
    }
    if (
      'checkedKeys' in nextProps && 
      !isContentEqual(nextProps.checkedKeys, this.state.checkedKeys)
    ) {
      const { checkedKeys, halfCheckedKeys } = calcCheckedKeys(
        nextProps.checkedKeys, 
        state.data || this.state.data, 
        this.props
      );
      state.checkedKeys = checkedKeys || [];
      state.halfCheckedKeys = halfCheckedKeys || [];
    }
    if (
      'selectedKeys' in nextProps && 
      !isContentEqual(nextProps.selectedKeys, this.state.selectedKeys)
    ) {
      state.selectedKeys = calcSelectedKeys(
        nextProps.selectedKeys, 
        state.data || this.state.data, 
        this.props
      );
    }
    if (!isEmptyObject(state)) {
      const hasExpand = !isEmptyArr(nextProps.expandedKeys) 
        || !isEmptyArr(this.props.expandedKeys)
        || nextProps.autoExpand
        || this.props.autoExpand;
      
      if (
        !this.state.currentPos
          && hasExpand
          && !isEmptyArr(state.data)
      ) {
        state.currentPos = getCurrentPos(
          nextProps.expandedKeys || this.props.defaultCheckedKeys, 
          nextProps.autoExpand || this.props.autoExpand, 
          state.data, 
          this.props.deep
        );
      }

      this.setState(state);
    }
  }

  isKeyChecked = key => {
    const { checkedKeys = [] } = this.state;
    return isInArr(key, checkedKeys);
  };

  setUncontrolledState = state => {
    let needSync = false;
    const newState = {};

    Object.keys(state).forEach(name => {
      needSync = true;
      newState[name] = state[name];
    });

    if (needSync) {
      setTimeout(() => {
        this.setState(newState);
      }, 0);
    }
  };

  onSelect = (key, treeNode) => {
    const { onSelect } = this.props;
    const currentPos = CascaderTree.getNodePos(treeNode);

    this.setState({ currentPos });
    
    if (isFunction(onSelect)) onSelect(key);
  };

  onBatchNodeCheck = (key, checked, halfChecked, startNode) => {
    if (startNode) {
      this.checkedBatch = {
        treeNode: startNode,
        checked,
        list: [],
      };
      const currentPos = CascaderTree.getNodePos(startNode);
      this.setState({ currentPos });
    }
    
    this.checkedBatch.list.push({ key, checked, halfChecked });
  };

  onCheckConductFinished = e => {
    const { onChange } = this.props;
    const { 
      checkedKeys = [], 
      halfCheckedKeys = [], 
      data 
    } = this.state;

    const checkedKeySet = {};
    const halfCheckedKeySet = {};

    checkedKeys.forEach(key => {
      checkedKeySet[key] = true;
    });
    halfCheckedKeys.forEach(key => {
      halfCheckedKeySet[key] = true;
    });

    this.checkedBatch.list
      .forEach(({ key, checked, halfChecked }) => {
        checkedKeySet[key] = checked;
        halfCheckedKeySet[key] = halfChecked;
      });

    const newCheckedKeys = Object
      .keys(checkedKeySet)
      .filter(key => checkedKeySet[key]);
    const newHalfCheckedKeys = Object
      .keys(halfCheckedKeySet)
      .filter(key => halfCheckedKeySet[key]);

    const eventObj = {
      event: 'check',
      node: this.checkedBatch.treeNode,
      checked: this.checkedBatch.checked,
      nativeEvent: e.nativeEvent,
    };

    eventObj.checkedNodes = [];
    eventObj.checkedNodesPositions = [];
    eventObj.halfCheckedKeys = newHalfCheckedKeys;

    newCheckedKeys
      .forEach(key => {
        const metaItem = (data.keyEntities || {})[key];
        if (!isEmptyObject(metaItem)) {
          const { node, pos } = metaItem;

          eventObj.checkedNodes.push(node);
          eventObj.checkedNodesPositions.push({ node, pos });
        }
      });

    this.setUncontrolledState({
      checkedKeys: newCheckedKeys,
      halfCheckedKeys: newHalfCheckedKeys,
    });

    const noRedundentCheckedKeys = getNoRedundent(newCheckedKeys, data);

    if (isFunction(onChange)) onChange(noRedundentCheckedKeys, eventObj);

    this.checkedBatch = null;
  };

  onExpand = (key, treeNode) => {
    const { data, onExpand } = this.props;
    const currentPos = CascaderTree.getNodePos(treeNode);

    this.setState({ currentPos });
    const expandedKeys = getKeysByPos(currentPos, data);
  
    if (isFunction(onExpand)) onExpand(expandedKeys);
  };

  // 树中的列(每一层中的active项)
  renderTreeGroup = level => {
    const {
      prefixClx,
      readOnly,
      multiple,
      checkDisabledKeys,
      checkDisabledPoss,
      renderTreeNode,
      data: treeMetaData
    } = this.props;
    const { 
      checkedKeys, 
      halfCheckedKeys, 
      selectedKeys, 
      data, 
      currentPos 
    } = this.state;

    const groupMetaData = getGroupData(level, currentPos, data);
    const jsxTreeItems = groupMetaData.map((metaItem, index_) => {
      const { 
        key: eventKey, 
        pos, 
        level, 
        index, 
        node, 
        isLeaf, 
        parentPos 
      } = metaItem;

      const checked = isInArr(eventKey, checkedKeys);
      const halfChecked = isInArr(eventKey, halfCheckedKeys);
      const checkDisabled = (
        isInArr(eventKey, checkDisabledKeys) ||
        isInArr(pos, checkDisabledPoss)
      );
      const selected = isInArr(eventKey, selectedKeys);

      return (
        <TreeItem
          prefixClx={prefixClx}
          readOnly={readOnly}
          eventKey={eventKey}
          pos={pos}
          item={node}
          data={metaItem}
          multiple={multiple}
          checked={checked}
          halfChecked={halfChecked}
          checkDisabled={checkDisabled}
          selected={selected}
          isKeyChecked={this.isKeyChecked}
          onSelect={this.onSelect}
          onExpand={this.onExpand}
          onBatchNodeCheck={this.onBatchNodeCheck}
          onCheckConductFinished={this.onCheckConductFinished}
          renderTreeNode={renderTreeNode}
          treeMetaData={treeMetaData}
        />
      );
    });

    return (<ul key={level}>{jsxTreeItems}</ul>);
  };

  render() {
    const { deep: propDeep } = this.props;
    const { data, currentPos, checkedKeys, selectedKeys, } = this.state;
    
    // 影响treeGroup的个数
    const deep = getMaxDeep(checkedKeys, selectedKeys, currentPos, data);
    const groupDeep = propDeep || Math.min(deep, maxDeep);

    const jsxItems = [];
    let $i;
    for ($i = 0; $i < groupDeep; $i++) {
      jsxItems.push(
        this.renderTreeGroup($i)
      );
    }
    
    return (
      <CascaderGroups data={jsxItems} />
    );
  }
}
