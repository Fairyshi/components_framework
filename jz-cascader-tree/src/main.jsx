import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';

import CascaderTree from './cascaderTree';
import PreviewList from './ui/PreviewList';
import Collapse from './ui/Collapse';

import { 
  isContentEqual,
  isEmptyObject,
  getTreeMetaInfo,
  toArr,
  toDel,
  isFunction,
} from './util';

import styles from 'antd/es/style/index.css';

export default class CascaderTreeMonitor extends PureComponent {
  static propTypes = {
    // 名称空间
    prefixClx: PropTypes.string,
    // 自定义类名
    className: PropTypes.string,
    // 自定义样式
    style: PropTypes.object,
    // 只读
    readOnly: PropTypes.bool,
    // 单选|多选 模式
    multiple: PropTypes.bool,
    // 选中的值
    selectable: PropTypes.bool,
    checkable: PropTypes.bool,
    // 显示选中信息预览框
    previewable: PropTypes.bool,
    // 深度： 级联树的组的个数（optional，本值设置后 maxDeep 将不生效）
    deep: PropTypes.number,
    // 最大深度： 级联树的组的最大个数
    maxDeep: PropTypes.number,
    // 所有的节点数据
    data: PropTypes.arrayOf(PropTypes.object),
    // 选择的值
    checkedKeys: PropTypes.arrayOf(PropTypes.string),
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * value中节点的上游路径中的父节点自动添加到value中 true | 'first' ，具体关联数列组中的 currentPos 的初始化
     *   值为true时，默认将第一列组中的第一个选中
     *   值为first时，默认将每一列组中的第一个选中，对应展开的pos为 0-0-... => 具体依据深度来
     */    
    autoExpand: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    // 子级节点被展开的项
    expandedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    // 不能切换check状态的节点位置
    checkDisabledPoss: PropTypes.arrayOf(PropTypes.string),
    // 不能切换check状态的节点key
    checkDisabledKeys: PropTypes.arrayOf(PropTypes.string),
    // 选中一项 UI
    onSelect: PropTypes.func,
    // 选择一项 form
    onChange: PropTypes.func,
    // 点击展开
    onExpand: PropTypes.func,
    // 删除单个已checked的item(PreviewPanel中调用)
    onRemove: PropTypes.func,
    // 清除所有checked的item(PreviewPanel中调用)
    onClear: PropTypes.func,
    // optional 自定义 节点的 文本部分的渲染方式
    renderTreeNode: PropTypes.func,
    renderTreeNodeInPreview: PropTypes.func,
    // 预览面板中自定义 节点的 文本部分的渲染方式【optional】
    previewClear: PropTypes.node,
    // 清除 预览框的 展开收起 触发键中dom内容
    collapseTrigger: PropTypes.node,
    // 空数据时的占位
    emptyContent: PropTypes.node,
  };

  static defaultProps = {
    prefixClx: 'cascadetree',
    readOnly: false,
    previewable: true,
    selectable: true,
    checkable: true,
    multiple: true,
    autoExpand: true,
    deep: 3,
    maxDeep: 3,
    data: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: [],
    defaultExpandedKeys: [],
    selectedKeys: [],
    checkedKeys: [],
    expandedKeys: [],
    checkDisabledKeys: [],
    checkDisabledPoss: [],
    onSelect: undefined,
    onChange: undefined,
    onExpand: undefined,
    renderTreeNode: undefined,
    renderTreeNodeInPreview: undefined,
    onRemove: undefined,
    onClear: undefined,
    previewClear: undefined,
    collapseTrigger: undefined,
    emptyContent: undefined,
  };

  constructor(props) {
    super(props);
  
    this.state = {
      // { metaList, keyEntities, posEntities }
      metaData: getTreeMetaInfo(props.data),
      checkedKeys: toArr(props.checkedKeys || props.defaultCheckedKeys),
      // expandedKeys: toArr(props.expandedKeys || props.defaultExpandedKeys),
    };
  }

  componentWillReceiveProps(nextProps) {
    const state = {};

    if (
      'data' in nextProps && 
      !isContentEqual(nextProps.data, this.state.data)
    ) {
      state.metaData = getTreeMetaInfo(nextProps.data);
    }

    if (
      'checkedKeys' in nextProps && 
      !isContentEqual(nextProps.checkedKeys, this.state.checkedKeys)
    ) {
      state.checkedKeys = nextProps.checkedKeys;
    }

    /* if (
      'expandedKeys' in nextProps && 
      !isContentEqual(nextProps.expandedKeys, this.state.expandedKeys)
    ) {
      state.expandedKeys = nextProps.expandedKeys;
    } */

    if (!isEmptyObject(state)) {
      this.setState(state);
    }
  }

  // 预览框：删除一项
  onDel = (key) => {
    const { checkedKeys = [] } = this.state;

    const newCheckedKeys = toDel(key, checkedKeys);
    this.setState({ checkedKeys: newCheckedKeys });

    this.notifyChange(newCheckedKeys);
  };

  // 预览框：清除所有项
  onClear = () => {
    const { onClear, onChange } = this.props;
    this.setState({ checkedKeys: [] });

    if (
      isFunction(onClear)
    ) {
      onClear();
    } 
    this.notifyChange([]);
  };

  // 树：选中项变化
  onChange = (checkedKeys = [], eventInfo = {}) => {
    const { checkedKeys: currentCheckedKeys } = this.state;
    const { event } = eventInfo;
    if (
      event === 'check' 
        && !isContentEqual(currentCheckedKeys, checkedKeys)
    ) {
      this.setState({ checkedKeys });
      
      this.notifyChange(checkedKeys);
    }
  };

  // 树：展开项变化
  onExpand = (expandedKeys) => {
    const { onExpand } = this.props;

    if (isFunction(onExpand)) onExpand(expandedKeys);
  };

  notifyChange = (val) => {
    const { onChange } = this.props;

    if (isFunction(onChange)) onChange(val);
  }
  
  // 有效选中项的全量信息
  getCheckedNodeMetaItems = () => {
    const { checkedKeys = [], metaData = {} } = this.state;
    const { keyEntities = {} } = metaData;

    const items = checkedKeys
      .filter(checkedKey => checkedKey in keyEntities)
      .map(key => keyEntities[key]);

    return items;
  }

  // 预览框：渲染内容
  renderPreview() {
    const { 
      readOnly, 
      renderTreeNodeInPreview, 
      previewClear, 
      emptyContent, 
    } = this.props;
    const metaItems = this.getCheckedNodeMetaItems();
    const data = metaItems.map(metaItem => metaItem.node);

    const jsxEmptyContent = emptyContent 
      || <p className="cascadertree-empty">暂无内容</p>;

    return (
      <PreviewList 
        readOnly={readOnly}
        data={data} 
        metaData={metaItems} 
        onDel={this.onDel}
        onClear={this.onClear}
        renderItem={renderTreeNodeInPreview}
        previewClear={previewClear}
        emptyContent={jsxEmptyContent}
      />
    );
  }

  // 树：渲染内容
  renderTree() {
    const {
      prefixClx,
      readOnly,
      selectable,
      multiple,
      selectedKeys,
      autoExpand,
      expandedKeys,
      checkable,
      checkDisabledKeys,
      checkDisabledPoss,
      onSelect,
      onExpand,
      renderTreeNode,
      deep,
      maxDeep,
    } = this.props;
    const { 
      checkedKeys = [], 
      metaData = {},
    } = this.state;

    return (
      <CascaderTree
        prefixClx={prefixClx}
        readOnly={readOnly}
        selectable={selectable}
        multiple={multiple}
        checkable={checkable}
        deep={deep}
        maxDeep={maxDeep}
        selectedKeys={selectedKeys}
        autoExpand={autoExpand}
        expandedKeys={expandedKeys}
        checkedKeys={checkedKeys}
        checkDisabledKeys={checkDisabledKeys}
        checkDisabledPoss={checkDisabledPoss}
        data={metaData}
        onChange={this.onChange}
        onSelect={onSelect}
        onExpand={onExpand}
        renderTreeNode={renderTreeNode}
      />
    );
  }

  render() {
    const { 
      previewable,
      prefixClx,
      className,
      collapseTrigger,
      style={}
    } = this.props;
    const clx = classNames(prefixClx, className);

    return (
      <div className={clx} style={style}>
        { previewable 
          ? [
            this.renderPreview(),
            <Collapse trigger={collapseTrigger}>
              {this.renderTree()}
            </Collapse>
          ] 
          : this.renderTree()
        }
      </div>
    );
  }
}
