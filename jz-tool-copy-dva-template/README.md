# jz-tool-copy-dva-template组件设计与实现

> 浏览bigfish文档过程中，看到了  vscode-bigfish-plugin 插件，试玩了下后思考这货的场景、对比我日常开发中常用的 vscode snippets 有何好处，深思并发挥了下，做了这个工具 copyDva


<a name="What"></a>
## What
让我们从繁复的 模版/文件 拷贝中解脱出来的工具，内置 react组件初始化模版、dva常用模版等模版。适用于 react、dva、bigfish、umi based项目。

**一个命令行让新页面触手可得。 五分钟完成一个 CRUD 模块的所有物料(****list-****view + ****list-****model + ****form-****view**** + ****form****-****model**** + service)初始化**

<a name="8e1b944f"></a>
## 背景
提效的途径之一是重复的工作工具化自动化，日常开发中 模块初始化、页面初始化、组件初始化等过程中，存在大量的文件拷贝，组件初始化文档的生成工作，这些重复的体力活消耗了大量的时间。<br />常见的偷懒姿势如下：
* 做好技术选型，当效率(非性能/定制化等)为主要矛盾时，复用优质轮子(bigfish、antd、ant-pro、各种库等)
* 使用或开发 **IDE插件**（如 vscode-bigfish-plugin）。
  * 准备
    * 本地先在vscode中安装 vscode-bigfish-plugin插件
  * 效果
    * ![vscode-bigfish-plugin.gif](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/copyDva1.gif)
  * 存在的问题
    * 需要全面兼顾所有用户的使用场景，因而往往牺牲了很多定制性，如上图中的初始化内容较少，远不能满足实际业务的需求如不能做项目级的配置(也可能以本地配置文件方式解)
    * 如果是定制的插件需要投入人力开发，与发布审核等各种流程，耗时耗力
    * 无法统一所有用户的 **IDE **类型与版本
* IDE snippets（即内容模版）
  * 准备
    * 本地先在vscode中配置好常用 模版/操作 的snippet
  * 效果
    * ![vscode-snippets-demo.gif](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/copyDva2.gif)
  * 存在的问题
    * 只能解决内容问题，目录/文件的创建仍然需要用户手动操作，如gif中的命令 `mkdir hehe && cd hehe` 、 `touch common.jsx pure.jsx` ，新建较少时没什么体感，但一旦躲起来着实繁琐
* 针对常用文档维护项目级/团队级模版，按需人肉拷贝
* **委托给工具**。如 `jz-tool-copy-dva-template` 

<a name="529a5277"></a>
## 特色&功能
* 模版拷贝
  * 支持内置模版
    * page/
    * component/
    * constant/
    * service/
  * 用户自定义 模版|目录
    * 如果是本地的普通目录且未配置占位符则相当于普通的目录拷贝
* 动态变量注入替换。支持文件拷贝过程中对预先配置好的占位符进行变量注入替换
* 按需拷贝定制。基于用户配置 `.copyconfig.json`  (项目根目录)
* 命令行接口(package.json/scripts 调用)

<a name="344b497b"></a>
## 安装与使用
<a name="e655a410"></a>
### 安装
```
tnpm i @alipay/jz-tool-copy-dva-template --save
```
<a name="ecff77a8"></a>
### 使用
<a name="15c64aa0"></a>
#### 配置文件
* 项目根目录中创建配置文件 `.copyconfig.json`  
* 在 `.copyconfig.json`  中配置执行参数，如
```json
{
  "src": {
    "dir": "",
    "root": "./.copyTemplates"
  },
  "target": {
    "dir": "",
    "root": ""
  },
  "injectedVars": {
    "appNamespace": "appFoo",
    "ContainerName": "AppFoo",
    "getDetail": "getFoo",
    "getOtherList": "getBars",
    "getList": "getFoos",
    "enableListItem": "enableFoo",
    "deleteListItem": "deleteFoo",
    "PureComponentName": "PureComponentName",
    "ClassComponent": "ClassComponent"
  }
}
```
<a name="e306b7e9"></a>
#### 注册调用命令
* 项目  `package.json` 中添加脚本命令
```
{
  "scripts": {
    "copyTemplate": "jz-tool-copy-dva-template",
  },
}

// script with params
{
  "scripts": {
    "copyTemplate": "jz-tool-copy-dva-template --src <yourSrcDir, optional> --target <yourtargetDir, optional>",
  },
}
```
<a name="1a6aa24e"></a>
### 执行
* 准备：提交|暂存项目中本地的所有变更 `git add . && git ci -m 'your comment'` 
* 项目根目录中执行 `npm run copyTemplate` 
* 项目中查看生成的产物
<a name="49b86040"></a>
### 调用栗子与产出
<a name="9c42416f"></a>
#### 栗子-内置模版全量拷贝&占位符替换
* 准备
  * package.json/script: { "copyTemplate": "jz-tool-copy-dva-template" },
  * `.copyconfig.json`  中不指定 src的内容
* 执行 `npm run copyTemplate` ：
  * 执行前
    * ![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/copyDva3.png)
  * 执行后
    * 类组件模版的产物<br />![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/copyDva4.png)
    * page/Crud/List.jsx的产物（对应常用列表查询与操作类的场景）

                   ![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/copyDva5.png)
    * page/Crud/List.jsx的产物（对应常用列表查询与操作类的场景）

                   ![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/copyDva6.png)
    * service/@todo.js的产物

                   ![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/copyDva7.png)
<a name="ea56dc19"></a>
#### 栗子-内置模版部分拷贝&占位符替换
![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/copyDva8.png)
<a name="5a670aa9"></a>
#### 栗子-用户自定义模版全量拷贝&占位符替换
![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/copyDva9.png)
<a name="4b9c2e04"></a>
#### 栗子-用户自定义模版部分拷贝&占位符替换
![image.png](https://raw.githubusercontent.com/Fairyshi/components_framework/master/assets/copyDva10.png)
<a name="1f11ebe6"></a>
#### 栗子-普通文件拷贝
参考 “栗子-用户自定义模版全量拷贝&占位符替换” ，除去占位符替换功能即可
<a name="54ea89b4"></a>
## 接口
* 全量拷贝
```
"scripts": {
   "copyTemplate": "jz-tool-copy-dva-template",
}
```

* 指定源/目标内置路径参数的命令，其中 --src参数的值、--target参数的值会分别覆盖配置文件中 src.dir、target.dir中的值
```
"scripts": {
  "copyTemplate": "jz-tool-copy-dva-template --src service --target service",
}
```

<a name="d1b10a77"></a>
### 命令行接口&参数
<a name="716f0a58"></a>
### 配置文件接口
| 名称 | 作用/说明 | 可选 | 默认值&栗子 |
| --- | --- | --- | --- |
| src | 拷贝源(模版)信息 | 是 | 内置模版 |
| src.root | 拷贝源(模版)根目录 | 是 | @alipay/jz-tool-copy-dva-template/templates |
| src.dir | 拷贝源根目录中内部的路径，非全量拷贝时使用 | 是 | 为空时即全量拷贝 |
| src | 拷贝源(模版)信息 | 是 | 内置模版 |
| src.root | 拷贝源(模版)根目录 | 是 | @alipay/jz-tool-copy-dva-template/templates |
| src.dir | 拷贝源根目录中内部的路径，非全量拷贝时使用 | 是 | 为空时即全量拷贝 |
| injectedVars | 占位符。需要在源目录的相关文件中以 mustache {{ }} 语法进行配置 | 是 | {}<br /><br />栗子：injectedVars: { foo: 'bar' }，<br />    如将dir/index.js中的 foo改为{{ foo }}，该文件被拷贝到目标目录后其中的{{ foo }}占位符均会被替换成bar |


<a name="38164c8b"></a>
## 实现
<a name="c222403a"></a>
### 目录结构
```
├── README.md
├── bin
│   └── jz-tool-copy-dva-template.js  // 脚本接口（使 package.json/script中的脚本代替了命令行调用 node ./node_modules/@alipay/jz-tool-copy-dva-template --src . --target ./target）
├── index.js
├── main.js                           // 实现主体
├── package.json
├── templates                         // 内置模版 （常用代码片段、常用dva代码片段&模版）
│   ├── component
│   │   ├── ClassComponent
│   │   │   ├── Main.jsx
│   │   │   ├── index.js
│   │   │   └── index.less
│   │   └── PureComponent
│   │       ├── Main.jsx
│   │       ├── index.js
│   │       └── index.less
│   ├── page
│   │   ├── Crud
│   │   │   ├── Form.jsx
│   │   │   ├── List.jsx
│   │   │   ├── index.less
│   │   │   ├── model
│   │   │   │   ├── Form.js
│   │   │   │   └── List.js
│   │   │   └── validator      // 校验器配置
│   │   │       └── form.js
│   │   └── MasterSlaves       // 适合较复杂页面，Master为dva实例，Slave为 dva-instance-like型，抽象的目的用途：保证职责单一的情况下兼顾dva的独立名称空间要求
│   │       ├── Master.jsx
│   │       ├── Slave1.jsx
│   │       ├── Slave2.jsx
│   │       ├── index.less
│   │       ├── model
│   │       │   ├── MasterForm.js
│   │       │   ├── _slave1.js
│   │       │   └── _slave2.js
│   │       └── validator
│   │           ├── _slave1.js
│   │           └── _slave2.js
│   └── service
│       └── @todo.js
└── util.js
```

<a name="d10b81e3"></a>
### 主要代码
```
const dirCopyTool = require('./util');
const packageJson = require('./package.json');

const CONFIG_FILE_NAME = '.copyconfig.json';

/**
 * 1.读取命令行参数
 * 2.读取配置文件内容
 * 3.合并文件内容
 * 4.确定运行参数：源、目标、配置
 */
const program = new commander.Command(packageJson.name)...

copyTemplates(program.src, program.target);

// 目录拷贝及占位符替换
function copyTemplates(src, target) {
  const root = path.resolve(process.cwd());
  const configFilePath = path.resolve(root, CONFIG_FILE_NAME);
  const configFile = require(configFilePath);
  const formToInfo = getFromToPath(src, target, configFile);

  fs.ensureDirSync(formToInfo.src);
  fs.ensureDirSync(formToInfo.target);
  const configInjectedVars = configFile.injectedVars || {};

  dirCopyTool(formToInfo.src, formToInfo.target, configInjectedVars);
}

/**
 * 将命令行参数与用户配置文件、内置模版目录等合并生成模版文件与目标文件
 * @param {*} src        命令行指定的待拷贝模版所在目录
 * @param {*} target     命令行指定的拷贝后的目标文件存放的目录
 * @param {*} configFile 用户配置文件（相对命令行易于维护）
 */
function getFromToPath(src, target, configFile = {}) {
  const configSrcObj = configFile.src || {};
  const configTargetObj = configFile.target || {};

  const innerTemplateRoot = path.resolve(__dirname, 'templates');
  
  const srcRoot = configSrcObj.root || innerTemplateRoot;
  const srcInnerPath = src || configSrcObj.dir;
  const targetRoot = configTargetObj.root;
  const targetInnerPath = target || configTargetObj.dir;

  const srcPath = path.resolve(srcRoot, srcInnerPath);
  const targetPath = path.resolve(targetRoot, targetInnerPath);

  return {
    src: srcPath,
    target: targetPath,
  };
}
```

<a name="ac9d3278"></a>
## 源码&仓库
* tnpm包：@alipay/jz-tool-copy-dva-template
* git代码仓库：[http://gitlab.alipay-inc.com/shifei.sf/jz-tool-copy-dva-template](http://gitlab.alipay-inc.com/shifei.sf/jz-tool-copy-dva-template)

<a name="19444e70"></a>
## 建议
* 内置的模版为作者根据项目(dva)&使用习惯进行的定制，考虑到各业务项目有定制需求，可以进行定制
  * fork并改造内置templates/ 中的内容，为业务定制
  * 项目中维护模版配置目录(如 .copyTemplates)及在 `.copyconfig.json`  中的指定 `src.root`  为该目录(否则工具会自动用内置的 templates/ 目录)，如 `{ src: {"root": "./.copyTemplates"} }` 
* 开发中亦可以将本工具当作 目录拷贝工具使用，配置好 src path(基于src.root+src.dir生成)、target path(基于target.root+target.dir生成)
