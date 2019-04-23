# babel

<a name="2zucol"></a>
## [](#2zucol)简介
> Babel是一个JavaScrpit的编译器，它能将es2015,react等低端浏览器无法识别的语言，进行编译。
> 
> 基本上如果不设置配置文件.babelrc，Babel运行的结果便是  **const babel = code => code** ，通过读取代码，最后生成一样的代码。
> 
> **_Babel的最核心的概念便是插件_**，通过在配置文件 .babelrc中添加不同的插件基本可以做所有的事情。


<a name="h4bhgf"></a>
## [](#h4bhgf)作用
* 最常使用的JavaScript转码工具

* 解决了我们使用next generation JavaScript的顾虑


<a name="rpc9fp"></a>
## [](#rpc9fp)配置
* .babelrc

  * > 通过在.babelrc文件中指定转码plugin、preset，babel才能达到指定特性的转码效果



<a name="regtvo"></a>
## [](#regtvo)常用babel package
* **babel-core:** 提供转码API，babel-core虽然常用，但日常开发很少直接调用

  * > webpack中使用babel-loader加载js，babel-loader其实会直接调用babel-core API对文件进行转码


* **babel-cli:** babel转码的命令行调用

* **babel-polyfill:** babel默认只做转码，不处理新的APi。ployfill解决这个问题（比如一些新内置对象、新的静态方法、实例方法）

* **babel-register:** 重写require函数

  * > 引人后，`require`方法会被重写并绑定一个hook到babel的complier，也就是说当再次通过`require`加载其他脚本文件时会在运行时自动通过babel转码之。不适用与生产环境


* **babel-preset-***:**  可以理解为plugin的组合


<a name="2lm9cy"></a>
## [](#2lm9cy)原理
<a name="apfgwh"></a>
### [](#apfgwh)编译过程
![](https://cdn.nlark.com/lark/0/2018/png/15078/1544752809855-eeec629a-8dd4-4d12-9d45-3c9c06211d0a.png#width=500)
<a name="3bxtgn"></a>
#### [](#3bxtgn)核心包
```
// 暴露babel.transform方法来编译source code
babel-core
// 语法字符串解析parser
babylon
// 结合plugins遍历AST语法树
babel-traverse
// 生成最后的编译字符串
babel-generator

作者：人间失格
链接：https://juejin.im/post/5afc141e51882542836e36cf
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```
<a name="ydszuq"></a>
#### [](#ydszuq)编译流程
```
input string
-> babylon parser
-> AST
-> babel-traverse  //使用plugins遍历AST语法树
-> AST
-> babel-generator
-> output string
```

<a name="7258hs"></a>
### [](#7258hs)执行过程![](https://cdn.nlark.com/lark/0/2018/png/15078/1544751092422-0a80c7df-1828-4c72-a1fd-93d772c0e230.png#width=600)
<a name="r1stzy"></a>
### [](#r1stzy)AST的解析过程
js语句被解析成AST中间有两个步骤，一个是分词，第二个是语义分析。<br />![](https://cdn.nlark.com/lark/0/2018/png/15078/1544751158352-0afadf98-02e9-471c-bfa3-3e7c1701a6f1.png#width=200)<br />语义分析分为两块，一块是语句，还有一块是表达式


<a name="tld9vc"></a>
## [](#tld9vc)webpack与babel
babel => js<br />typescript <br />  => js+ <br />  => ts "ts file" <br />    => 静态语法检查<br />    => "js file" <br />webapck <br />  => js、css、less、html、svg。。。。 <br />  => babel-loader 4 js<br />  => ts-loader ts file => babel-loader js file



<a name="x671rx"></a>
## [](#x671rx)补充
TC39 Process规定了每项新特性纳入规范的过程，分为5个阶段
* stage0: strawman，可以理解成idea迸发

* stage1: proposal，也就是书面化产出一个提案

* stage2: draft，产出规范的草案

* stage3: candidate，该特性进入候选阶段

* stage4: finished，会尽快随版正式发布


<a name="k00wxn"></a>
## [](#k00wxn)Refs
* [babel](https://juejin.im/entry/597ca5df518825059d5d56cf)

* [Babel用户手册](https://juejin.im/entry/596878f651882548ae433ff0)

* [babel原理简介](https://juejin.im/post/5ab35c3cf265da23771951a2)

* [Babel知识体系浅谈](https://zhuanlan.zhihu.com/p/24648188)

* [Babel工作原理及Babel插件开发探索](https://juejin.im/entry/5a9bfb88f265da2381551741)

* [Babel用户手册](https://juejin.im/entry/596878f651882548ae433ff0) todo

* [Babel 教程](https://www.gitbook.com/book/ironmaxtory/babel)  todo



