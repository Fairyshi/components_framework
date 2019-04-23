# CascaderTree 级联树

[]()<a name="8e1b944f"></a>
## 背景

业务中常常需要对树形数据的展示和操作。一般地，会从层级(如`antd-Tree`)和深度两个维度进行结构化展示，`CascaderTree`从径向对树节点的路径进行横向平铺展示。支持树节点的选择（单|多）、自定义渲染、选择结果基于树结构进行合并、选择结果预览等功能。具体应用如地理位置、行政区划数据的平铺展示。

[]()<a name="da441097"></a>
## 代码演示

[]()<a name="20def794"></a>
### 图片

![](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1546484995319-ba7ad758-bc02-4d92-8047-51e4197fb943.png#alt=undefined)

<a name="Gif"></a>
### Gif

![](https://intranetproxy.alipay.com/skylark/lark/0/2019/gif/15078/1546487518271-375cad5f-6054-4d6c-a641-d21818bc4aeb.gif#alt=areaTree.gif)

<a name="API"></a>
## API

[]()<a name="f5a616d8"></a>
### 级联树组件属性

| 参数 | 说明 | 类型 | 默认值 | 是否必传 |
| --- | --- | --- | --- | --- |
| readOnly | 是否是只读的 | boolean | false | 否 |
| multiple | 支持点选多个节点（节点本身） | boolean | true | 否 |
| selectable | 节点文本区是否响应点击操作 | boolean | true | 否 |
| checkable | 单选or多选节点是否响应点击操作 | boolean | true | 否 |
| previewable | 是否展示「选中结果预览框」 | boolean | true | 否 |
| deep | 级联层的个数 | number | 3 | 否 |
| maxDeep | 级联层的最大个数，超过则横向滚动展示 | number | 3 | 否 |
| data | 树数据 | array<{key,label,value,title,children}> | [] | 是 |
| checkedKeys | (受控)选中的 keys | array | [] | 否 |
| selectedKeys | (受控)选择的 keys | array | [] | 否 |
| expandedKeys | (受控)展开的 keys | array | [] | 否 |
| defaultCheckedKeys | 选中的 keys | array | [] | 否 |
| defaultSelectedKeys | 选择的 keys | array | [] | 否 |
| defaultExpandedKeys | 展开的 keys | array | [] | 否 |
| checkDisabledPoss | (受控)禁止选中的位置 | array | [] | 否 |
| checkDisabledKeys | (受控)禁止选中的keys | array | [] | 否 |
| autoExpand | 自动展开 | boolean | true | 否 |
| onSelect | select to fire | function(keys, e:{ ..., nativeEvent}) | - | 否 |
| onChange | 树中选中or取消选中，及预览框中删除时触发 | function(keys, e:{ ..., nativeEvent}) | - | 否 |
| onExpand | 展开/收起节点时触发 | function(expandedKeys, {expanded: bool, node}) | - | 否 |
| onRemove | 预览框中删除指定项时触发，未传则调用onChange | function(keys) | - | 否 |
| onClear | 预览框中清除所有项时触发，未传则调用onChange | function([]) | - | 否 |
| renderTreeNode | 级联树中节点的自定义渲染 | function() | - | 否 |
| renderTreeNodeInPreview | 预览框中节点的自定义渲染 | function() | - | 否 |
| previewClear | 自定义的预览框「清除」控件 | function() | - | 否 |
| collapseTrigger | 自定义预览框中「展开or收起」控件 | function() | - | 否 |
| emptyContent | 无选中值时预览框中的占位符 | function() | - | 否 |


[]()<a name="344b497b"></a>
## 安装与使用

[]()<a name="e655a410"></a>
### 安装

```
tnpm install @alipay/jz-cascader-tree --save
```

[]()<a name="f58e8aa9"></a>
### 本地封装

```
// src/component/CascaderTree/index.jsx
import React, { PureComponent } from 'react';
import JzCascaderTree from '@alipay/jz-cascader-tree';
import '@alipay/jz-cascader-tree/assets/index.css';

// @component CascaderTree的封装，功能+样式
export default class CascaderTree extends PureComponent {
  render() {
    return <JzCascaderTree {...this.props} />;
  }
}
```

[]()<a name="54fb7b93"></a>
### 业务调用

```
// biz file
import CascaderTree from '@/component/CascaderTree';
...
<CascaderTree
  autoExpand="first"
  readOnly={readOnly}
  deep={3}
  data={areas}
  checkedKeys={areaId}
  checkDisabledPoss={['0']}
  onChange={this.onChange}
/>
...
```

<a name="FAQ"></a>
## FAQ
