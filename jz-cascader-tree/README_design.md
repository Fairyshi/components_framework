# jz-cascader-tree组件故事

[]()<a name="e655a410"></a>
## 安装

```
tnpm install @alipay/jz-cascader-tree --save
```

[]()<a name="8d316e90"></a>
## 引用方式

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

[]()<a name="7af4456f"></a>
## 信息背景

级联树形数据 展示与操作，支持操作数据的预览。

[]()<a name="da441097"></a>
## 代码演示

[]()<a name="a3b69b86"></a>
### 基础使用栗子

![](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1546483855900-bf70549d-3502-45e7-bd06-8a29f82a18d6.png#alt=undefined)<br />
![](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1546483872929-d95e8087-b9bf-4bff-9b23-42c78eab32c1.png#alt=undefined)<br />
![](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1546483880367-5048dd99-cc8e-4af6-a2bd-f4ffc4d81e68.png#alt=undefined)

[]()<a name="6a4909f9"></a>
### 地理位置数据栗子

![](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1546483889840-b1e8df03-fc8b-4b39-909f-3fd2818341d1.png#alt=undefined)

<a name="API"></a>
## API

| name | description | type | default |
| --- | --- | --- | --- |
| prefixClx | prefix class | String | 'cascadetree' |
| className | additional css class of root dom node | String |  |
| style | style to CascaderTreeMonitor | Object | {} |
| readOnly | whether disable the tree and the preview | boolean | false |
| multiple | use checkbox on true, radio on false | boolean | true |
| selectable | response to click text | boolean | true |
| checkable | enable checkbox or radio | boolean | true |
| previewable | show preview box for displaying checked values | boolean | true |
| deep | deep for cascader tree group | number | 3 |
| maxDeep | max deep for cascader tree group, scroll shows on overflow | number | 3 |
| data | tree data Array, if set it then you need not to construct children. | array<{key,title,children}> | - |
| checkedKeys | checked keys | array | [] |
| selectedKeys | selected keys | array | [] |
| expandedKeys | expanded keys | array | [] |
| defaultCheckedKeys | checked keys on initing | array | [] |
| defaultSelectedKeys | selected keys on initing | array | [] |
| defaultExpandedKeys | expanded keys on initing | array | [] |
| checkDisabledPoss | checked disabled pos | array | [] |
| checkDisabledKeys | checked disabled keys | array | [] |
| autoExpand | expand if needed | boolean | false |
| onSelect | select to fire | function(keys, e:{ ..., nativeEvent}) | - |
| onChange | change(on check in tree box, remove and clear in preview box) to fire | function(keys, e:{ ..., nativeEvent}) | - |
| onExpand | expand to fire in tree box | function(keys, e:{ ..., nativeEvent}) | - |
| onRemove | remove to fire in preview box | function(keys, e:{ ..., nativeEvent}) | - |
| onClear | clear to fire in preview box | function(keys, e:{ ..., nativeEvent}) | - |
| renderTreeNode | render tree node in tree(optional) | function() | - |
| renderTreeNodeInPreview | render tree node in preview(optional) | function() | - |
| previewClear | render clear trigger in preview(optional) | function() | - |
| collapseTrigger | render collapse trigger in preview(optional) | function() | - |
| emptyContent | render empty content in preview(optional) | function() | - |


[]()<a name="5b804b05"></a>
## 源码

* [仓库](https://gitlab.alipay-inc.com/shifei.sf/jz-cascader-tree)
