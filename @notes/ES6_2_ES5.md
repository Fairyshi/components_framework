# ES6 2 ES5

<a name="ytnags"></a>
## [](#ytnags)Babel 
将JS新特性转化为运行环境(浏览器、node等)中可以执行的版本

<a name="wmbmai"></a>
## [](#wmbmai)常用的解析包
| 包名 | 作用 |
| --- | --- |
| babel-loader | webpack的loader，进行语法转换的通知 |
| babel-core | 解析转化参数与进行转换的真正执行者 |
| babel-preset-env | 语法按需转换，申明的运行环境中需要的、不能支持的语法 => 避免冗余的转换 |
| babel-preset-es* | 语法转换，转换为指定版本 |
| babel-preset-stage-* | 语法转换，转换为指定版本 |
| babel-polyfill | api转换 |
| babel-runtime | API转换中多个模块中通用代码重复问题。官方建议用于生产 |
| babel-plugin-transform-runtime | API转换中多个模块中通用代码重复问题。用于dev环境 |

<a name="babel-loader"></a>
### [](#babel-loader)babel-loader
**三种传参方式**：url、options配置、.babelrc

```
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/, // 不对node_modules目录下的文件进行编译，可以提升webpack打包速度，其他loader也有这个配置
      use: {
        loader: 'babel-loader',
        // #传参方式一
        // loader: 'babel-loader?cacheDirectory', // 使用缓存目录它可以进一步提升webpack的编译速度
        // #传参方式二
        options: { 
          presets: ['@babel/preset-env']，// babel预设
          plugin: ['@babel/plugin-proposal-object-rest-spread'] // 所需要使用的插件
        }
        // #传参方式三
        // 这个配置单独拿出来，创建一个‘.babelrc’文件来单独存放配置项
      }
    }
  ]
}
```

<a name="ftf1zf"></a>
### [](#ftf1zf)babel-core
bable的入口，解析执行的调度者。 只有通过它，webpack才能使用各种babel的api。

<a name="qopzki"></a>
## [](#qopzki)语法解析
<a name="49180d8e"></a>
### [](#babel-preset-es-和-babel-preset-stage)babel-preset-es* 和 babel-preset-stage-*
<a name="f194abe9"></a>
#### [](#将代码转化为-es3)将代码转化为 ES3
```
babel-preset-es3
```

<a name="c2782ca5"></a>
#### [](#将代码转化为-es5)将代码转化为 ES5
```
'babel-preset-es2015' ，
'babel-preset-stage-0' ，
'babel-preset-stage-1' ，
'babel-preset-stage-2' ，
'babel-preset-stage-3' ，
```

<a name="ba847e11"></a>
#### [](#将代码转化为-es6)将代码转化为 ES6
```
'babel-preset-es2016' 将ES2016转化成ES6，
'babel-preset-es2017' 将ES2017转化成ES6，
```

<a name="76rubt"></a>
## [](#76rubt)Api 解析
<a name="babel-polyfill"></a>
#### [](#babel-polyfill)babel-polyfill
编译JavaScript中新的API。有三种引入方法：<br />一、那个模块需要就在那个模块引入
```
npm install --save-dev babel-polyfill
```
二、全局引入方法1，在项目的入口文件引入，如果项目有多个入口，则在每个需要的入口分别加入
```
require('babel-polyfill');
```
三、全局引入方法2，可以在项目的 `webpack.config.js` 的入口配置项中引入
```
entry: {
    app: ['babel-polyfill', './main.js']
}
```

<a name="pdaomo"></a>
#### [](#pdaomo)babel-runtime & babel-plugin-transform-runtime
解决babel-polyfill带来的冗余问题
> `babel-plugin-transform-runtime` 包含一个内置的polyfill(它包含一个自定义的regenerator运行时和core.js)，所以，在webpack中使用 `ProvidePlugin` 用 `shimming` 方法定义 `Promise` 将不起作用。



<a name="2yfgnw"></a>
### [](#2yfgnw)面向运行环境解析 env preset
babel-preset-env 允许你指定一个代码执行环境，并且只编译该环境缺少的特性。<br />而非 babel-pre-env 预设存在的问题在于它们往往做得太多。很多运行环境已经支持了的无用的部分。<br />.babelrc 配置文件栗子如下：
```
// 支持最近两个版本的浏览器和IE7以上的浏览器。
"presets": [
    [
      "env",
      {
        "targets": {
          "browsers": ["last 2 versions", "ie >= 7"]
        }
      }
    ]
  ]
```

<a name="29b30175"></a>
### [](#其它babel插件)其它babel插件
```
babel-plugin-tranform-classes // 解决ES6类（class）的兼容性
```


<a name="fkrszm"></a>
## [](#fkrszm).babelrc的几个栗子【presets & plugins】
```
{
    "presets": ["es2015"],
    "plugins": ["transform-runtime"]
}
```

```
{
    "presets": ["es2015", "es-stage-2"],
    "plugins": ["transform-runtime"]
}
```

```
{
    "presets": ["es2015"],
    "plugins": ["transform-runtime"].
    "env": {
        "targets": {
            "browsers": ["last 2 versions", "safari >= 7"], // 浏览器
            "node": "6.10" // node 
        }
    }
}
```

