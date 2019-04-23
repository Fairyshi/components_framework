# jz-bizTable组件设计

<a name="2fd2c8b1"></a>
## 主要场景
> 背景：
> `crud` 是中后台应用的常见操作，表格作为批量查询结果的格式化展现几乎是各模块中不可或缺的组件。`Antd-table` 已将业务中表格的纯UI部分做了很好的封装，并在 `React` 项目中广泛使用。
> 业务实践中发现表格在`Antd-table` 之上仍有不少通用部分可以进行上层封装，以减少业务模块中大量重复逻辑。


<a name="341d6123"></a>
## 功能设计
<a name="31762d66"></a>
### 主要功能
* **表格列 基于配置自动解析**
* 表格「行|列表」关联报错信息解析 (antd通用报错样式)
* 常用过滤器
  * Input类型筛选器，触发 `dva` 的 `effect` 联动表单数据与表格异步更新请求
  * Select类型筛选器
    * 根据配置自动格式化 `Select` 下拉列表
    * 触发 `dva` 的 `effect` 联动表单数据与表格异步更新请求
  * TriggerFilter类型表格数据请求触发器
<a name="9726466b"></a>
### 主要组件
| 名称 | 作用/说明 |
| --- | --- |
| BizTableMonitor(Main) | 1.初始化时，自动请求表格数据；<br />2.根据「列配置信息」自动解析 「扩充|格式化|错误识别...」 列内容 |
| InputFilter | Input类型过滤器，联动更新表内容 |
| SelectFilter | Select类型过滤器：<br />1.格式化展现Select过滤器内容；<br />2.根据配置自行请求自身的表数据； <br />3.联动更新表内容 |
| TriggerFilter | 请求触发器（过滤器中常见的）, 点击自动请求更新表内容 |
| ClipBoard | 用于复制所在列的内容到「剪贴板」， 列配置申明即可使用 |


<a name="1aec0675"></a>
### 列配置信息column._config
| 名称 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prefix | column中列内容的前缀 | React node | null |
| prefixColor | color name of the prefix color dot in column | String | null |
| suffix | column中列内容的后缀 | React node | null |
| clipboard | column中复制列内容到「剪贴板」的申明 | Boolean | false |
| href | 超链接类型的列内容，配合props.Link一起使用 | String or Function | null |
| textRight | textAlign of the column content is right | Boolean | false |
| ellipsis | 列内容单行呈现，超出则“省略号” | Number | undefined |
| multiEllipsis | 列内容不超过指定行数，超出则“省略号” | Number | undefined |
| format | 对列内容用内置的formatter格式化后呈现 | String | null |

<a name="3cbcaeff"></a>
#### column._config.format 说明
| format值 | 描述 |
| --- | --- |
| percentage | 将列内容格式化为「百分数」 |
| float | 将列内容格式化为「两位数」(最常用的类型) |
| integer | 将列内容格式化为「整数」 |
| date | 将列内容格式化为「YYYY-MM-DD」格式的日期 |
| time | 将列内容格式化为「HH:MM:SS」格式的时间 |


<a name="62af0fe9"></a>
### 组件接口
<a name="BizTableMonitor"></a>
#### BizTableMonitor
```
<BizTableMonitor
  dataSource={bizTableData}
  columns={columns}
  config={{
    namespace: 'helloworld', // 对应dva的module中的namespace
    dispatch: () => {},      // 对应dva的module中的dispatch
  }}
  errorInfo={{}} // 声明则含错的「行|列」中自动含有 Antd 中通用的报错样式类名(用于报错提示)
/>
```
<a name="InputFilter"></a>
#### InputFilter

```
// 调用申明
<InputFilter
  config={{
    dispatch: dispatch,
    namespace: 'helloworld',
    effect: 'masterList', // 对应dva的module中的effect
  }}
/>

// 主要效果
...
onBlur = () => {
  ...
  dispatch({
    type: `${namespace}/${effect}`,
    payload: { keyword: value }
  });
  ...
};
...
```

<a name="SelectFilter"></a>
#### SelectFilter
```
// 调用申明
<SelectFilter
  filter="size"
  labelField="helloworldText" // 解析成Select list中label指定的字段值
  valueField="helloworldId"   // 解析成Select list中value指定的字段值
  config={{
    dispatch: dispatch,       // 对应dva的module中的dispatch
    namespace: 'helloworld',  // 对应dva的module中的namespace
    effect: 'masterList',     // 对应dva的module中的effect
  }}
  data={[                     // Select list中的下拉列表内容
    {helloworldId: 'id1', helloworldText: 'text1'},
    {helloworldId: 'id2', helloworldText: 'text2'},
  ]}
/>

// 主要效果
...
componentDidMount() {
  dispatch({ type: `${namespace}/${effect}` });
}
...

...
onChange = (value) => {
  ...
  dispatch({
    type: `${namespace}/${effect}`,
    payload: {
      [filter]: value
    }
  });
  ...
};
...
```

<a name="TriggerFilter"></a>
#### TriggerFilter
```
// 调用申明
<TriggerFilter
  config={{
    dispatch: dispatch,
    namespace: 'helloworld',
    effect: 'masterList', // 对应dva的module中的effect
  }}
/>

// componentDidMount时自动请求表数据
...
dispatch({
  type: `${namespace}/${effect}`,
});
...
```

<a name="7d6e16f7"></a>
## 功能实现
<a name="2ba87d95"></a>
### 目录组织

```
├── ClipBoard.jsx     // 表列中的剪贴板，列配置中申明即可用
├── InputFilter.jsx   // 输入框类型的表数据筛选项，失焦自动发表数据请求
├── Main.jsx          // BizTableMonitor,对Antd Table的业务封装：支持1.自动初始化请求表数据；2.对表的列进行业务配置等功能
├── SelectFilter.jsx  // Select类型的表数据筛选项 
├── TriggerFilter.jsx // 触发器类型的表数据筛选项，点击自动发表数据请求
├── index.js
├── mock.js           // mock数据
└── util.js           // 工具类
```

<a name="55e4b26d"></a>
## 发布信息
<a name="54fb7b93"></a>
### 业务调用

```
import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';
import BizTable from '@alipay/jz-bizTable';

import { bizTableData } from './mock';

import 'antd/lib/style';
import 'antd/lib/table/style';
import 'antd/lib/icon/style';
import styles from '../assets/index.less';

export const columns = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
  _config: {
    prefix: <Icon type="bar-chart" />,
    suffix: <Icon type="setting" />,
  }
}, {
  title: '分数',
  dataIndex: 'score',
  key: 'score',
  _config: {
    clipboard: true,
    format: 'float',
    suffix: <Icon type="question-circle" />,
  }
}, {
  title: '百分比',
  dataIndex: 'percent',
  key: 'percent',
  _config: {
    format: 'percentage',
    textRight: true,
  }
}, {
  title: '住址',
  dataIndex: 'address',
  key: 'address',
  _config: {
    prefixColor: 'green',
    href: 'www.taobao.com',
    /* multiEllipsis: 2, */
    ellipsis: true,
  }
}, {
  title: '日期',
  dataIndex: 'createTime',
  key: 'createTimeDate',
  _config: {
    format: 'date',
  }
}, {
  title: '时间',
  dataIndex: 'createTime',
  key: 'createTimeTime',
  _config: {
    format: 'time',
  }
}];

class Demo extends React.Component {
  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>BizTable Demo</h2>
        <BizTable
          dataSource={bizTableData}
          columns={columns}
          config={{
            namespace: 'helloworld',
            dispatch: () => {},
          }}
          errorInfo={{
            // 声明则含错的「行|列」中自动含有 Antd 中通用的报错样式类名(用于报错提示)
          }}
        />
      </div>
    );
  }
}

```

<a name="e443715c"></a>
### 使用效果
![biztable1.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1549037697259-46df1a8f-9fff-43cf-986c-b8df3508209f.png#align=left&display=inline&height=372&name=biztable1.png&originHeight=890&originWidth=1784&size=143903&width=746)
<a name="88e568d1"></a>
#### 相关配置信息
<a name="53fdb015"></a>
### ![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1549041913694-dfbb2bc6-0f8d-47ac-8ff0-33d107a55076.png#align=left&display=inline&height=349&name=image.png&originHeight=698&originWidth=2778&size=495432&width=1389)
<a name="298a31bf"></a>
### tnpm包
 包名：@alipay/jz-bizTable<br /> 仓库地址：git@gitlab.alipay-inc.com:shifei.sf/jz-bizTable.git

