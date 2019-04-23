# SmartSelector 组件设计

<a name="2fd2c8b1"></a>
## 主要场景
<a name="facd2603"></a>
### 表的跨页选中数据的汇总预览/批量操作
![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector1.png)
<a name="826fab9c"></a>
### 树数据的不同路径数据的汇总预览/批量操作
![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector2.png)

<a name="341d6123"></a>
## 功能设计
<a name="9726466b"></a>
### 主要组件
| 名称 | 作用/说明 | 举例 |
| --- | --- | --- |
| PreviewableSmartSelector | 带选择结果汇总预览功能的<br /> `SmrtProvider`  | 「PreviewList + Antd-Table」、「PreviewList + CascaderTree」 |
| SelectedProvider | 数据的输入端，注入初始数据到store中 | 「Antd-Table」、「CascaderTree」 |
| SelectedConsumer | 根据Store中的数据切换显示具体组件、读取Store中数据的状态 | 「全选|取消全选」、<br />「批量启用-无选中项时不显示功能入口」、<br />「批量启用-禁用Button态」、<br />「批量启用-点击时读Store中的value状态」、 |
| TiggerAll | 全选&#124;取消全选 | 根据Store中的数据自动显示“取全选”or“取消全选” |
| Store | 选中值、数据源、选中状态的维护者 |  |
| PreviewList | （跨页）所选结果的汇总预览组件 |  |


<a name="62af0fe9"></a>
### 组件接口
<a name="SmartProvider"></a>
#### SmartProvider
```
<SmartProvider store={pagedStore/*分页功能*/}>
  <Table {...props} />
</SmartProvider>

<SmartProvider store={store}>
  <CascaderTree {...props} />
</SmartProvider>
```

<a name="d41d8cd9"></a>
#### 
<a name="PreviewableSmartSelector"></a>
#### PreviewableSmartSelector
```
<PreviewableSmartSelector store={pagedStore/*分页功能*/}>
  <Table {...props} />
</PreviewableSmartSelector>

<PreviewableSmartSelector store={store}>
  <CascaderTree {...props} />
</PreviewableSmartSelector>
```
* ~~使用~~
```
<SmartProvider store={pagedStore/*分页功能*/}>
  <Table {...props} />
</SmartProvider>

<SmartProvider store={store}>
  <CascaderTree {...props} />
</SmartProvider>
```

<a name="SelectedConsumer"></a>
#### SelectedConsumer
提供三种调用方式。
```bash
// Case1: 无选中值时不显示功能入口
<SelectedConsumer hideOnEmpty store={store}>
  <Button>全部启用</Button>
</SelectedConsumer>

/*
 * Case2: 无选中值时，用组件默认内置的显示方式，
 * 即为一级子组件添加 disabled(「Antd组件」组件常用)、readOnly(业务组件常用),即不响应click事件
 */
<SelectedConsumer store={store}>
  <Button>全部启用</Button>
</SelectedConsumer>

// Case3: 无选中值时，用户自定义的显示方式
<SelectedConsumer emptyText={<Button disabled>全部启用,不能点击时给些提示</Button>} store={store}>
  <Button>全部启用</Button>
</SelectedConsumer>
```
<a name="d41d8cd9"></a>
#### 
<a name="SelectedConsumerGroup"></a>
#### SelectedConsumerGroup
区别于 「批量触发」SelectedConsumer的 muliple 版本，一次处理多个 
```bash
// Case1: 无选中值时不显示功能入口
<SelectedConsumerGroup hideOnEmpty store={store}>
  <Button>全部启用</Button>
  <Button>全部编辑</Button>
  <Button>全部提交</Button>
</SelectedConsumer>
```

<a name="TriggerAll"></a>
#### TriggerAll
* Ui类(ui/TriggerAll.jsx)
```
<TriggerAll
  onText="全选"      // 非全选状态下显示的内容
  offText="取消全选" // 全选状态下显示的内容
  checked           // 是否选中
  readOnly          // 只读状态
/>
```
* 功能类(src/TriggerAll.jsx)
```
<TriggerAll
  onText="全选"      // 非全选状态下显示的内容
  offText="取消全选" // 全选状态下显示的内容
/>
```

<a name="PreviewList"></a>
#### PreviewList
* Ui类(ui/PreviewList.jsx)
```
<PreviewList 
  readOnly
  data=[{}, {}, ...]
  keyField="label"
  renderItem=(item)=>()  // 可选。自定义item的渲染方式（可选），默认显示label中item中keyField指定字段的内容
/>
```
* 功能类(src/PreviewList.jsx)
```
<PreviewList 
  readOnly
  store={}
  renderItem=(item)=>()  // 可选。自定义item的渲染方式（可选），默认显示label中item中keyField指定字段的内容
/>
```

<a name="Store"></a>
#### Store
* util/Emitter.js
```
// 观察者
class Emmiter {  
  array listeners;  // 数据订阅者，Store中的数据变化时需要通知的回调
  
  function subscribe(listener: fn):function unsubscribe()=> {}     // 注册监听者
  function reset()                  // 取消所有监听
  function emitter()                     // 发送store状态变更通知
}
```
* src/StoreBasic.js
```
// 选中数据的维护者
class StoreBasic extends Emmiter {
  private object cache;    // 私有，数据汇总存储 { [keyField]: { item } }
  string keyField;         // 主键key default 'fid'）;
  array value;             // 选中的值 ['fid1', 'fid2', ...]
  array data;              // value对应的详细信息
  
  function isAllSelected() {}            // 所有可选项均选中
  function isAnySelected() {}            // 有选中项
  function get() {}                      // 所有选择的 keyField数据
  function select(keyField[], item[]) {} // 设置选中值，并存储相应的数据
  function selectAll(item[]) {}          // 选中所有值，参数为 false时为取消选中所有                  
  function reset() {}                    // 选中所有值，参数为 false时为取消选中所有
  function clear() {}                    // 清除所有数据及状态
}
```
* ~~src/StorePaged.js~~
```
// 分页记忆管理功能的选中数据维护者，常见应用 表 Antd-Table
class StorePaged extends BasicStore {
  array current；  // 当前页中的所有值
}
```

<a name="7d6e16f7"></a>
## 功能实现
<a name="597fd978"></a>
### 类图
![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector3.png)
<a name="2ba87d95"></a>
### 目录组织

```
├── index.js
├── mock.js
├── smartSelector
│   ├── PreviewList.jsx
│   ├── PreviewableTableSelector.jsx
│   ├── SelectedConsumer.jsx
│   ├── SelectedConsumerGroup.jsx
│   ├── SmartProvider.jsx
│   ├── StoreBasic.js
│   ├── TriggerAll.jsx
│   └── index.js
├── ui
│   ├── PreviewList.jsx
│   ├── TiggerAll.jsx
│   └── index.js
└── util
    ├── Emitter.js
    ├── constant.js
    └── index.js
```

<a name="55e4b26d"></a>
## 发布信息
<a name="54fb7b93"></a>
### 业务调用

```
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';

import Table, { 
  PreviewList, 
  SelectedConsumer, 
  SmartProvider, 
  TriggerAll,
  StoreBasic,
} from 'jz-SmartSelector';

import { tableData, columns } from './mock';

const store = new StoreBasic('key'); // 每个行item的唯一键，对应Table组件调用时的rowKey

class Demo extends React.Component {
  render() {
    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    const onSubmit = (value, event) => {
      console.log('---call batch submit, seleted item info:---');
      console.log(value, event);
      alert(`
当前的用户选项是: ${JSON.stringify(value)}；
全量信息是: 
    ${JSON.stringify(event)}
      `);
    };

    const onEdit = (value, event) => {
      console.log('---call batch edit, seleted item info:---');
      console.log(value, event);
    };

    return (
      <div style={{ margin: 20 }}>
        <h2>Cascader Demo</h2>
        <p>
          <TriggerAll 
            store={store} 
          />
        </p>
        <p>
          <SelectedConsumer store={store} emptyContent={<a>无选项时,自定义「批量提交」UI</a>}>
            <Button type="primary" onClick={onSubmit}>批量提交</Button>
          </SelectedConsumer>
        </p>
        <p>
          <SelectedConsumer store={store}>
            <Button type="primary" onClick={onEdit}>批量编辑</Button>
          </SelectedConsumer>
        </p>
        <Table
          store={store}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData} 
        />
        {/* <SmartSelector
          data={treeData}
          checkedKeys={[
            'value0', 
            'value1-1', 
            'value2-0',
          ]}
        /> */}
      </div>
    );
  }
}

```

<a name="e443715c"></a>
### 使用效果
* 未选时
![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector4.png)

* 全部选中
![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector5.png)
* 全选状态下，外置的 选择项 消费端被点击时读取选中状态后再触发点击回调

![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector6.png)

![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector7.png)

![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector8.png)
<a name="298a31bf"></a>
### tnpm包
 包名：@alipay/jz-SmartSelector<br /> 仓库地址：git@gitlab.alipay-inc.com:shifei.sf/jz-SmartSelector.git

