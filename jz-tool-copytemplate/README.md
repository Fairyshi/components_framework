## jz-tool-copytemplate项目设计
## 背景
- 提效的途径之一是重复工作工具化，日常开发中存在大量的文件拷贝，组件初始化文档的生成工作。避免重复操作的方式：1.IDE插件（如vscode-bigfish-plugin），可定制性不强 2.IDE snippet，只能解决内容问题，目录/文件的创建仍然需要用户手动操作 3.针对常用文档维护项目级/团队级模版，委托给命令行工具

### 功能
- 内置模版/用户指定模版拷贝
- 文件拷贝过程中对关键词进行变量注入替换
- 可解析用户配置
- 命令行接口

### 实现
#### 目录结构
- 内置模版目录（支持字符串替换）
  - page/
  - component/
  - constant/
  - service/
- 用户自定义模版目录
  - 用户配置文件

#### 配置接口
- src root
- src dir
- target root
- target dir
- template dir 用户自定义的模版目录，如未找到则会用内置的template目录
- injectedVars: { foo: 'bar' }，需要在源目录的相关文件中以 mustache {{ }} 语法进行配置
    如将dir/index.js中的 foo改为{{ foo }}，该文件被拷贝到目标目录后其中的{{ foo }}占位符均会被替换成bar

#### 职责划分
- jz-tool-copy: 读取命令行参数、用户配置文件(.copyconfig.json)，合并/冲突处理，根据配置与命令获取拷贝源与拷贝目标
  - 命令行参数解析
  - 配置文件读取 
  - 文件拷贝
  - 字符串注入
- jz-tool-copy-dva-template
  - 内置dva的常见初始化模版
  - 支持拷贝page、component、constant、service等常见文件模版

## 后续优化
- 冲突检测
- 文件拷贝


## demo路径
/Users/shifei/Desktop/study/@alipay/jz-tool-copy-dva-template-demoProject

