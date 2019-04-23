# jz-SmartSelector组件故事

<a name="e655a410"></a>
## 安装
```
tnpm install @alipay/jz-SmartSelector --save
```
<a name="8d316e90"></a>
## 引用方式
<a name="f58e8aa9"></a>
### 本地封装
```
// src/component/SmartSelector/index.jsx
import React, { PureComponent } from 'react';
import SmartSelector from '@alipay/jz-SmartSelector';
import '@alipay/SmartSelector/assets/index.css';
// @component CascaderTree的封装，功能+样式
export default class SmartSelector extends PureComponent {
  render() {
    return ;
  }
}
```
<a name="54fb7b93"></a>
### 业务调用
```
// biz file
import SmartSelector from '@/component/SmartSelector';
...
...
```
<a name="7af4456f"></a>
## 信息背景
本组件将选择项结果的统一管理从业务中剥离，在需要使用多选结果的位置调用组件即可获取。封装了表的跨页选中数据的汇总预览/批量操作、树数据的不同路径数据的汇总预览/批量操作、单|多（如Button、Select）个UI及自定义UI组件的批量选择结果访问触发器。

<a name="029b0af4"></a>
## 栗子
<a name="348091da"></a>
### ![ss1.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector9.png)

![ss2.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector10.png)

![ss3.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector11.png)


![smartselector.gif](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/SmartSelector12.gif)
<a name="API"></a>
## API
见[组件设计](https://yuque.antfin-inc.com/shifei.sf/wgecwq/bq316x) [](https://yuque.antfin-inc.com/shifei.sf/wgecwq/bq316x)<br />
    [
      
    ]()
  
    [
      
    ]()
  
    [
      
    ]()
  
<a name="5b804b05"></a>
## 源码
* [仓库](https://gitlab.alipay-inc.com/shifei.sf/jz-SmartSelector)
