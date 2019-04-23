# webpack与webpack-cli

<a name="uvkwvs"></a>
## [](#uvkwvs)背景
`webpack`  与 `webpack-cli` 不兼容导致编译报错，表现为 `npm start` 、 `npm run dll` 均跑不起来：<br />![](https://cdn.nlark.com/lark/0/2018/png/15078/1537868041567-93e0f501-90cf-44d8-995a-ebae846f0c3b.png#width=747)

进到 `/Users/shifei/Desktop/dspfe/node_modules/_webpack-cli@2.1.5@webpack-cli/bin/config-yargs.js:89:48)` 查看源码，跟踪并打印参数：<br />![](https://cdn.nlark.com/lark/0/2018/png/15078/1537868219285-a63f5418-9fed-41f5-a406-d01646e4b2cc.png#width=400)

<a name="sm2fdq"></a>
## [](#sm2fdq)解决路径
* 进到 `node_module` 的 `webpack_cli` 中查看相应的文件中确实木有该字段，初步怀疑是版本问题

  * 进入 `npm` 官网，查看最新的 `webpack`  和 `webpack_cli`  两个包的相关文件无冲突问题，照理说最新版本的这两个包应该是match 的，故而分别升级本地 `package.json`  的 `webpack`  和 `webpack_cli`  到各自的最新版后, 删除项目中 `node_module` 的这两个包后 `tnpm i` ，重新  `tnpm start` 即可。

<a name="oldydy"></a>
## [](#oldydy)启发
* 对于模块化管理的项目，如 `webpack` 、`dva` 等分开引入 主-从(1->n) 包 时需要考虑兼容的问题，最好是看到有生产或者靠谱的开源项目中用过，然后再在 项目中启用～
