import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Icon, Checkbox, Radio } from 'antd';
import classNames from 'classnames';
import { 
  isFunction, 
  isEmpty,
  isEmptyObject,
  getItemDesc,
  isParent,
} from '../util';

/**
 * @component {ui} 
 * @param {*} param0 
 */
export default class TreeItem extends PureComponent {
  static propTypes = {
    // 名称空间
    prefixClx: PropTypes.string,
    // 是否可交互
    readOnly: PropTypes.bool,
    // key
    eventKey: PropTypes.string.isRequired,
    // 在树中的位置
    pos: PropTypes.string,
    data: PropTypes.shape({
      // key
      key: PropTypes.string,
      pos: PropTypes.string,
      // 当前节点在树中的深度
      level: PropTypes.number,
      // 当前节点在兄弟节点中的次序
      index: PropTypes.object,
      // 原始的用户item
      node: PropTypes.object,
      // 叶子节点
      isLeaf: PropTypes.bool,
      // 父级的pos
      parentPos: PropTypes.string,
    }),
    // 所有的节点数据
    treeMetaData: PropTypes.shape({
      metaList: PropTypes.array,
      keyEntities: PropTypes.object, 
      posEntities: PropTypes.object, 
    }),
    // 当前节点数据
    item: PropTypes.object,
    // 单选 or 多选
    multiple: PropTypes.bool,
    // 是否选中
    checked: PropTypes.bool,
    // 是否半选
    halfChecked: PropTypes.bool,
    checkDisabled: PropTypes.bool,
    // 选中的值
    selected: PropTypes.bool,
    expandable: PropTypes.bool,
    // 选中一项 UI
    onSelect: PropTypes.func,
    // 点击展开
    onExpand: PropTypes.func,
    // 选择一项 form
    onBatchNodeCheck: PropTypes.func,
    // 选择一项 form
    onCheckConductFinished: PropTypes.func,
    // optional 自定义 节点的 文本部分的渲染方式
    renderTreeNode: PropTypes.func,
  };

  static defaultProps = {
    prefixClx: 'cascadetree',
    readOnly: false,
    eventKey: '',
    pos: '',
    data: {},
    treeMetaData: {
      metaList: [],
      keyEntities: {}, 
      posEntities: {},
    },
    item: {},
    multiple: true,
    checked: false,
    halfChecked: false,
    checkDisabled: false,
    expandable: true,
    selected: false,
    onSelect: undefined,
    onExpand: undefined,
    onChange: undefined,
    onBatchNodeCheck: undefined,
    onCheckConductFinished: undefined,
    renderTreeNode: undefined,
  };

  onCheck = e => {
    const { 
      eventKey,
      readOnly,
      checked,
      data,
      onBatchNodeCheck,
      onCheckConductFinished,
    } = this.props;
    const { parentPos } = data;

    if (readOnly) return;
    e.preventDefault();

    const tgtChecked = !checked;
    onBatchNodeCheck(eventKey, tgtChecked, false, this);

    this.onDownCheckConduct(tgtChecked);

    if (parentPos) {
      this.onUpCheckConduct(parentPos, tgtChecked, false, e, eventKey);
    } else {
      onCheckConductFinished(e);
    }
  };

  onDownCheckConduct = nodeChecked => {
    const { 
      data, 
      isKeyChecked, 
      onBatchNodeCheck, 
      treeMetaData = {},
    } = this.props;
    const { posEntities } = treeMetaData;

    const { pos } = data;
    
    if (!isEmptyObject(posEntities)) {
      Object
        .keys(posEntities)
        .forEach(tgtPos => {
          if (isParent(pos, tgtPos)) {
            const tgtKey = posEntities[tgtPos].key;
            if (nodeChecked !== isKeyChecked(tgtKey)) {
              onBatchNodeCheck(tgtKey, nodeChecked, false);
            }
          }
        });
    }
  };

  onUpCheckConduct = (parentPos, nodeChecked, nodeHalfChecked, e, eventKey) => {
    const { 
      checked, 
      halfChecked, 
      onBatchNodeCheck, 
      onCheckConductFinished, 
      isKeyChecked, 
      treeMetaData = {},
    } = this.props;
    const { posEntities } = treeMetaData;
    const parentMeta =  posEntities[parentPos];

    if (isEmpty(parentPos) || isEmptyObject(parentMeta)) {
      onCheckConductFinished(e);
      return;
    }

    const children = (parentMeta || {}).children || [];

    let checkedCount = nodeChecked ? 1 : 0;

    children.forEach((metaItem, index) => {
      if (isKeyChecked(metaItem.key) && metaItem.key != eventKey) {
        checkedCount += 1;
      }
    });
    const enabledChildrenCount = children.length;
    const nextChecked = enabledChildrenCount === checkedCount;
    const nextHalfChecked = nodeHalfChecked 
      || (checkedCount > 0 && !nextChecked);

    if (
      checked !== nextChecked 
        || halfChecked !== nextHalfChecked
    ) {
      onBatchNodeCheck(
        parentMeta.key, 
        nextChecked, 
        nextHalfChecked
      );

      if (
        isEmpty(parentMeta.parentPos)
          || parentMeta.parentPos === ''
      ) {
        onCheckConductFinished(e);
      } else {
        this.onUpCheckConduct(
          parentMeta.parentPos, 
          nextChecked, 
          nextHalfChecked, 
          e, 
          parentMeta.key
        );
      }
    } else {
      onCheckConductFinished(e);
    }
  };

  onExpand = () => {
    const { eventKey, onExpand } = this.props;
    if (isFunction(onExpand)) onExpand(eventKey, this);
  };

  onSelect = () => {
    const { item, onSelect } = this.props;
    if (isFunction(onSelect)) onSelect(item.key, this);
  };

  renderSelector = () => {
    const {
      prefixClx,
      readOnly,
      multiple,
      checked,
      halfChecked,
      checkDisabled,
    } = this.props;

    return (
      <span className={classNames(prefixClx, 'tree-item-selector')}>
        {
          multiple ?
            <Checkbox
              disabled={readOnly || checkDisabled}
              checked={checked}
              indeterminate={halfChecked}
              onChange={this.onCheck} 
            /> :
            <Radio
              disabled={readOnly || checkDisabled}
              checked={checked}
              onChange={this.onCheck}
            />
        }
      </span>
    );
  };

  render() {
    const {
      prefixClx,
      data,
      renderTreeNode,
    } = this.props;
    const jsxSelector = this.renderSelector();
    const { node, pos, isLeaf } = data;
    const jsxText = (
      <span 
        className={classNames(prefixClx, 'tree-item-text')} 
        onClick={this.onSelect}
      >{
        renderTreeNode 
          ? renderTreeNode(node) 
          : getItemDesc(node)
      }</span>
    );

    const jsxExpand = !isLeaf ? (
      <span 
        className={classNames(prefixClx, 'tree-item-expand')} 
        onClick={this.onExpand} 
      >
        <Icon type="right" />
      </span>
    ) : <span className="tree-item-expand-placeholder" />;

    return (
      <div className={classNames(prefixClx, 'tree-item')}>
        {jsxSelector}
        {jsxText}
        {jsxExpand}
      </div>
    );
  }
}
