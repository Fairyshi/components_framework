# roadhog 2 webpack4 (dsp)

<a name="gqb7kn"></a>
## [](#gqb7kn)背景
> roadhog的黑盒不利于定制，修改起来各种制肘，不利于定制及扩展和维护，欲弃之，基于webpack4定制。


<a name="tc4fge"></a>
### [](#tc4fge)槽点举栗
* es6的新语法如 `export * from ...` 支持不了（报错如下图）。在 `roadhog.config.js`   & `webpack.config.js`    中做了相应的配置，但由于 `roadhog` 内部将基础的几个 ES6 的 预设 & 插件实现了，确没有复写或覆盖的钩子|接口留出来，导致没办法传相应的用户参数，不能改。。。


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534517592130-07a99be9-c438-4df7-9b67-1a3cdfb72ddf.png#width=600)<br /> 
<a name="9ce1qp"></a>
## [](#9ce1qp)webpack4方案试水中 踩坑 & 解决
<a name="vsi7sp"></a>
### [](#vsi7sp)总体方案
```
// root/webpack/ 

├── echo-polyfill.sh
├── utils.js
├── webpack.common.config.js
├── webpack.dev.config.js
├── webpack.dll.config.js
└── webpack.prod.config.js

// root/bin/

├── check-dependencies.sh
├── externals2libs.js
├── lint-pre-commit.sh
├── zipdist.js
└── zipdist.sh
```

```
// part of package.json
{
  "sideEffects": false,
  "scripts": {
    "dll": "rm -rf dist && webpack --config webpack/webpack.dll.config.js",
    "prestart": "ls dist/vendor-manifest.json >> /dev/null 2>&1 || tnpm run dll",
    "start": "webpack-dev-server --config webpack/webpack.dev.config.js",
    "debug": "DEBUG=true webpack-dev-server --config webpack/webpack.dev.config.js",
    "stats": "webpack --config webpack/webpack.prod.config.js --client-log-level none --profile --json > stats.json",
    "view": "webpack-bundle-analyzer stats.json",
    "prebuild": "rm -fr dist",
    "build": "NODE_ENV=production webpack --config webpack/webpack.prod.config.js",
    "postbuild": "sh ./webpack/echo-polyfill.sh && node bin/zipdist.js",
    "lint": "eslint --ext .jsx,.js src/",
    "lint-fix": "eslint --ext .jsx,.js src/ --fix",
    "lint:pre-commit": "sh ./bin/lint-pre-commit.sh",
    "ci": "tnpm run build",
    "check-dependencies": "sh ./bin/check-dependencies.sh",
    "precommit": "npm run lint:pre-commit -q",
    "postmerge": "npm run check-dependencies -q",
    "synclibs": "node bin/externals2libs.js"
  },
}
```


<a name="8uixsx"></a>
### [](#8uixsx)踩坑笔记
* 问题


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534518276176-b2b3e2de-0534-43a0-a690-20a958ddbc4e.png#width=600)
* 解决


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534518288584-4ff40356-29fa-40ca-904c-6f2eca6fde75.png#width=286)
<a name="cah7tu"></a>
### 
* 问题


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534518305699-8b66767d-11e1-4c39-9b1b-417f60514f02.png#width=600)
* 解决


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534518322304-9df88730-a9cb-4f08-816c-627e94152f5d.png#width=400)

* 问题


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534518340389-d48c5e31-c879-4efa-86d6-e1218b78ff89.png#width=600)
* 解决


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534518361508-313ef4da-e607-413e-8c28-4ddda138bf66.png#width=400)
<a name="d567cr"></a>
### 
* 问题


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534518373401-7ec508f5-e2d2-48f6-a6d9-2e7372b9227f.png#width=600)
* 解决


[link](https://babeljs.io/docs/en/babel-preset-env/#usebuiltins)<br />![](https://cdn.nlark.com/lark/0/2018/png/15078/1534518412401-d371bb2a-913b-4139-a94b-7186e62281bc.png#width=600)<br />![](https://cdn.nlark.com/lark/0/2018/png/15078/1534518427120-22fc4e5d-4b9f-47fb-82d9-96c414c7a6f1.png#width=600)


<a name="e65zge"></a>
### [](#e65zge)html-webpack-plugin
<a name="zgqxon"></a>
#### [](#zgqxon)问题
* 插件调用


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534584858457-4344f614-deab-4dd9-b9ed-caa5898368f6.png#width=500)
* `npm start`  后的 控制台输出


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534584921708-f1817964-188f-4757-a634-007e69ed356b.png#width=500)
* `myproject/dist/`  下无任何新文件


`npm start` 后无任何新文件产生，控制台结果的是脚本跑完了，但一直挂起，而且提示 `entrypoint undefined`  以为是 插件调用报错，排查良久。看了 `html-webpack-plugin` 相关的 `issue` 不少同学遇到，也提供了一些解决方式，尝试了下没用。作者的答复很含糊。喝杯水，转念思索，作为一个这么多用户而且官网推荐的插件，为什么会这样，很不合理啊！如果真是一个问题不应该是这个状态！尝试按照启动的端口访问了一下启动的端口，服务启起来了，而且 `dev` 下该有的绑定都已注入到 `html template` 中！对比如下：
* vm template


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534585664947-9f4767a8-93c1-40ee-9531-1d508e588e13.png#width=500)
* 启动后的页面代码


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534585676396-b066653a-3348-4e30-89ee-fd75327de23c.png#width=500)<br />其中 【绿框】部分的脚本为 `html-webpack-plugin`  及  add-asset-html-webpack-plugin`` 注入的 `chunks` 

<a name="5iy1br"></a>
### [](#5iy1br)common chunk
![](https://cdn.nlark.com/lark/0/2018/png/15078/1534597985672-e0b59d74-a8bb-4ba5-a55e-53ebd240116d.png#width=500)
<a name="ror3xa"></a>
#### [](#ror3xa)问题
![](https://cdn.nlark.com/lark/0/2018/png/15078/1534598018139-c328f70b-6dbc-4218-b112-561a18f752dd.png#width=400)

![](https://cdn.nlark.com/lark/0/2018/png/15078/1534598042125-79df06ae-003a-4876-b2e7-402fa5770ba5.png#width=400)
<a name="r9m6ra"></a>
#### [](#r9m6ra)解决
![](https://cdn.nlark.com/lark/0/2018/png/15078/1534598167095-76daba49-fc19-4644-8164-9b7f7420b139.png#width=400)

![](https://cdn.nlark.com/lark/0/2018/png/15078/1534598118984-5a0c9dab-235a-4d81-9096-72a4875b2ba4.png#width=400)

<a name="11ulso"></a>
#### [](#11ulso)require 
* 问题


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534727379525-c4858189-79cb-4d06-9e88-395b448ddc2d.png#width=500)

![](https://cdn.nlark.com/lark/0/2018/png/15078/1534727386152-5b2eb984-649c-468b-8b1e-efe680d43214.png#width=500)
* 解决


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534727445893-0d865b0a-cea2-4561-9bb3-a868a3c9d105.png#width=383)

<a name="obbxru"></a>
### [](#obbxru)less-loader
<a name="pyg0rg"></a>
#### [](#pyg0rg)module/rules重复冲突
* 现象


![](https://cdn.nlark.com/lark/0/2018/png/15078/1535003292353-53cf3dbd-763d-48de-8cd8-59f03700108e.png#width=400)
* 思路


实践优点长，Google & baidu 没什么解法，github上亦如是，不少人遇到 ==> 解决启示 [github issue](https://github.com/webpack-contrib/less-loader/issues/51) by [pterolex](https://github.com/pterolex)
> I was getting the same error when I had two loaders for less in webpack.config

配置webpack时用了 webpack-merge`` ，与这个库的解析有关
* 解决


![](https://cdn.nlark.com/lark/0/2018/png/15078/1535003478130-4f3a4253-3798-4708-8459-4730c81b7830.png#width=500)
* 启示


这种坑在搜索引擎中撒网效率不一定高，google前五行不奏效的则应立刻取GitHub看issue，精准定位有木有～
<a name="5altzd"></a>
#### [](#5altzd)业务中的.less(非外部库中的)丢失
* 现象


  处理结果不注入到 dom:class属性中也不加载
* 解决


`css-loader` 中添加 `module: true`  配置
<a name="uh8qxv"></a>
### [](#uh8qxv)dev-server
<a name="dpooae"></a>
#### [](#dpooae)代理请求在控制台失效
* 现象


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534819399633-bd271626-ec1a-4fe2-b802-a672c5816ebe.png#width=500)
* 解释


`webpack-dev-server` 的代理通过 http-proxy-middleware`` 实现，在 `node` 端代理服务，浏览器请求 开发服务端，由开发服务端做代理转发请求，所以控制台看到的请求仍为请求本地的服务而非开发环境的 `host` <br />![](https://cdn.nlark.com/lark/0/2018/png/15078/1534820051191-4d27023a-c9a0-413b-b8ac-3fa17af6ba86.png#width=600)
<a name="2bgbdy"></a>
#### [](#2bgbdy)cookie等参数
* 问题


请求已发出，但接口返回失败，具体为：response中报 “请求超时”
* 思路


请求超时，一般关联几项：`http-header` 中与缓存时间相关的设置；后端在种在 `cookie` 或 `ctooken` 中的超时校验数据。检查控制台中相应请求的header中这些项缺失：没有 `localhost` 对应的 `hostname` 中的 `cookie` 均为空
* 解决


访问dev下的页面，获取即时的 cookie 配置，在 `application` 中拷贝到 `localhost` 下，再次访问 ok~<br />![](https://cdn.nlark.com/lark/0/2018/png/15078/1534820802636-a483dce8-db6b-4d27-8fe8-fb6d2cdfc873.png#width=500)

<a name="qdmgbi"></a>
### [](#qdmgbi)FriendlyErrorsWebpackPlugin引起的 --profile --json 统计信息4可视化解析失败
<a name="smaopl"></a>
#### [](#smaopl)背景
* `webpack --profile --json` 可将 `webpack`  构建过程从起点到终点中涉及的 资源(整个解析过程)的详细信息以 `json` 的格式做日志输出。好处不言而喻，此处省略 n多个字...，结果形如：


![](https://cdn.nlark.com/lark/0/2018/png/15078/1535030063535-18b9db1b-e34f-4383-b683-a7c7c2da0fc6.png#width=500)
* webpack-bundle-analyzer`` 可解析上述 `stats.json` 文件并以 可视化形式输出到页面，效果如下：


![](https://cdn.nlark.com/lark/0/2018/png/15078/1535030311467-e72b03d4-b41c-4b69-9e05-d4cc7227b8de.png#width=600)
<a name="r74ecs"></a>
#### [](#r74ecs)踩坑
* 问题

  * 运行  webpack-bundle-analyzer stats.json`` 时一直报错，解析失败。根据报错 `log` 查看了下该统计文件，发现非标准的 `json` ，文件头部含有 编译期输出的 `WARNIG` 信息。导致可视化展示前的json文件解析过程失败。 


![](https://cdn.nlark.com/lark/0/2018/png/15078/1535031076371-10982c58-650f-4262-9a1b-1e8304c45318.png#width=400)
* 思路


根据 `webpack` 官网建议的 设置 `stats: { warningsFilter: /export .* was not found in/, warnings: false }` 也尝试了用其建议的 预设 `stats: ``minimal` ,也失败。Google && github 了个遍，百思不其姐-_-
* 解决


折腾良久木有思路，不知道哪里多出来的这个鬼！只能追根溯源，用 There are multiple modules with names that only differ in casing`` 在源码中定位出是 friendly-errors-webpack-plugin`` 这个插件报粗的，基本就有了思路：<br />为 优化开发过程中的体验，借助 friendly-errors-webpack-plugin`` 对输出到输出流的提示信息做了处理。但也因此将标准输出流中的信息做了重定向到相应的输出端中。一般情况下该输出为终端，不会有什么问题，但因为 利用`webpack` 的统计输出接口 webpack --config webpack/webpack.prod.config.js --profile --json > dist/stats.json``  导致输出端被指定为 `stats.json` 这个文件。因此 整个构建过程结束后，webpack的插件会往其中添加 `WARNING` `ERROR` 这些干扰的日志信息。 <br />主要代码如下：
```
// package.json 中的日志生成中添加状态 STATS
"stats": "STATS=true webpack --config webpack/webpack.prod.config.js --profile --json > dist/stats.json",

// webpack.common.config.js 通用配置中针对 STATS 这种情况不添加 FriendlyErrorsWebpackPlugin插件
const isStats = !!process.env.STATS;
{
  plugins: [ ..., !isStats && new FriendlyErrorsWebpackPlugin()].filter(Boolean),
}
```
------      开心ing~~😄😄😄😄😄😄       ------


未完待续～
<a name="bywzgl"></a>
### [](#bywzgl)未解决项
<a name="fb8nct"></a>
#### [](#fb8nct)prop-types
* 配置


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534599590192-2fefb10c-6f46-4554-9619-00bc38dfb578.png#width=500)

![](https://cdn.nlark.com/lark/0/2018/png/15078/1534599607002-50d0a08b-9585-4f64-9c32-6d1fb6dbd0e9.png#width=500)

* 运行时报错


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534599470572-0c25f67a-4e11-46fd-9176-08d841cae310.png#width=500)

<a name="xo89wl"></a>
#### [](#xo89wl)require
* 问题


`src/index.js` 中的 `require` 一个模块时会默认添加 `default`  并将引入的模块挂到该 `default` 属性下。应用中通过，`default` 值的取值解决，但没弄明白其中的机制 -_-  这个需要先hold一下，待环境搭完再回头研究下～
* 解决


![](https://cdn.nlark.com/lark/0/2018/png/15078/1534729596945-a44939f7-be25-4831-b2d2-9dc280d06c25.png#width=500)

* plugin transform-runtime 

  * 现象


![](https://cdn.nlark.com/lark/0/2018/png/15078/1536146949348-a0e3ad51-2c2a-486d-96f7-54a862f1c3a8.png#width=500)
* 解决


![](https://cdn.nlark.com/lark/0/2018/png/15078/1536147071145-56a6f43c-e5fb-4e70-9c1a-317ce4ec8237.png#width=500)

<a name="u5yzmm"></a>
## [](#u5yzmm)思考
<a name="s9nwdn"></a>
### [](#s9nwdn)cookie配置
较之手动在 `application` 下 `copy & paste`  有木有自动化或更优雅的方式解决

<a name="0ahdir"></a>
## [](#0ahdir)总结
前期的调研尽量细致，看其他项目的方案时，多问为什么，考虑关键场景，重点部分的细节差异。如 dg中 dll包构建时 对 dependencies中的处理，和 editor库做的特殊处理，以及非业务构建部分的，独立库并未在 vm中引用（对焦 @文虹 了解到其实是做的按需加载）诸如此类，多思考，深入思考后，对焦 相关同学，多问别人的考量，多沟通，也适当加入自己的感受。这里不得不提到其在public/中的设置，如加入业务和日志模版以外还单独复制了 vm用于真实使用的情况（虽然后续文档更新同步没做到位）但对于其他了解与维护该项目的同学着实友好，细节处体现相关同学的用心，做开发就应该这样。

真正动手实现一遍会踩不少坑，但 磨刀不误砍柴工 中间发现问题解决问题的过程是真正打磨自己的过程，纸上得来终觉浅绝知此事要躬行～

