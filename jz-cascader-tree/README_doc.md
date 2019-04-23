# jz-cascader-tree
---

tree ui component for react

[![NPM version][npm-image]][npm-url]

## Screenshots

<img src="https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1546397911557-43c6bb84-b355-42a3-ab69-52c1351f9b85.png" width="600"/>

<img src="https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1546397920584-4fbc1dd7-6f54-40a6-9600-80e22dfbe776.png" width="600"/>

<img src="https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1546397928119-267b78c9-5fc3-4e69-874b-f52e5300d52b.png" width="600"/>

<img src="https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1546484995319-ba7ad758-bc02-4d92-8047-51e4197fb943.png" width="600"/>

<img src="https://intranetproxy.alipay.com/skylark/lark/0/2019/gif/15078/1546487518271-375cad5f-6054-4d6c-a641-d21818bc4aeb.gif" width="600"/>

## Feature

* Support all popular browsers, including Internet Explorer 9 and above.

## Example

http://localhost:8036/examples/
(http://localhost:8036/examples/basic.html)

online example: http://react-component.github.io/tree/examples/  

## install

[![jz-cascader-tree](https://nodei.co/npm/jz-cascader-tree.png)](https://npmjs.org/package/jz-cascader-tree)

## Usage

see examples

## API

### CascaderTreeMonitor props

| 参数     | 说明    | 类型     | 默认值      | 是否必传      |
|----------|----------------|----------|--------------|--------------|
| readOnly | 是否是只读的 | boolean | false | 否 |
| multiple | 支持点选多个节点（节点本身） | boolean | true | 否 |
| selectable | 节点文本区是否响应点击操作 | boolean | true | 否 |
| checkable | 单选or多选节点是否响应点击操作 | boolean | true | 否 |
| previewable | 是否展示「选中结果预览框」 | boolean | true |否 |
| deep | 级联层的个数 | number | 3 | 否|
| maxDeep | 级联层的最大个数，超过则横向滚动展示 | number | 3 | 否 |
| data | 树数据 | array<{key,label,value,title,children}> | [] |是 |
| checkedKeys | (受控)选中的 keys | array | [] | 否|
| selectedKeys | (受控)选择的 keys | array | [] |否 |
| expandedKeys | (受控)展开的 keys | array | [] | 否|
| defaultCheckedKeys | 选中的 keys | array | [] | 否|
| defaultSelectedKeys | 选择的 keys | array | [] |否 |
| defaultExpandedKeys | 展开的 keys | array | [] |否 |
| checkDisabledPoss | (受控)禁止选中的位置 | array | [] |否 |
| checkDisabledKeys | (受控)禁止选中的keys | array | [] | 否|
| autoExpand | 自动展开 | boolean | true | 否 |
| onSelect | select to fire | function(keys, e:{ ..., nativeEvent}) | - | 否|
| onChange | 树中选中or取消选中，及预览框中删除时触发 | function(keys, e:{ ..., nativeEvent}) | - |否 |
| onExpand | 展开/收起节点时触发 | function(expandedKeys, {expanded: bool, node}) | - |否 |
| onRemove | 预览框中删除指定项时触发，未传则调用onChange | function(keys) | - | 否 |
| onClear | 预览框中清除所有项时触发，未传则调用onChange | function([]) | - | 否 |
| renderTreeNode | 级联树中节点的自定义渲染 | function() | - |否 |
| renderTreeNodeInPreview | 预览框中节点的自定义渲染 | function() | - | 否|
| previewClear | 自定义的预览框「清除」控件 | function() | - |否 |
| collapseTrigger | 自定义预览框中「展开or收起」控件 | function() | - | 否 |
| emptyContent | 无选中值时预览框中的占位符 | function() | - | 否 |

### CascaderTree props
> note: if you have a lot of CascaderTree, like more than 1000,   
> make the parent node is collapsed by default, will obvious effect, very fast.  
> Because the children hide CascaderTree will not insert into dom.


## note

Here is the description.


## Development

```
npm install
npm start
```

## Test Case
http://localhost:8036/tests/runner.html?coverage

## Coverage

http://localhost:8036/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8036/tests/runner.html?coverage

## License
jz-cascader-tree is released under the MIT license.

## other foo view
- [none]()
