# Node web框架

<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1547282183809-2f5ff2cd-ebe3-4cad-9685-5c69b4369e32.png#align=left&display=inline&height=361&name=image.png&originHeight=722&originWidth=732&size=53087&width=366)


<a name="6bdcbb47"></a>
### 历程
**express -> koa / koa2 -> chair -> egg**
<a name="Express"></a>
#### Express
> 基于 Node.js 平台，快速、开放、极简的 Web 开发框架

第一代最流行的web框架，对Node.js的http进行了封装。API很简单，但是它是基于ES5的语法，要实现异步代码，只有一个方法：回调。如果异步嵌套层次过多，代码写起来就非常难看。
<a name="Koa"></a>
#### Koa
> Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，可以快速而愉快地编写服务端应用程序。

* Koa1.0：利用generator解决 「回调」问题
> 随着新版Node.js开始支持ES6，Express的团队又基于ES6的generator重新编写了下一代web框架koa。和Express相比，koa 1.0 使用generator实现异步 ，代码看起来像同步的。

用generator实现异步比回调简单了不少，但是generator的本意并不是异步。Promise才是为异步设计的，但是Promise的写法……想想就复杂。为了简化异步代码，ES7（目前是草案，还没有发布）引入了新的关键字`async`和`await`，可以轻松地把一个function变为异步模式
* Koa2.0
> koa团队并没有止步于koa 1.0，他们非常超前地基于 ES7 开发了koa2，和koa 1相比，koa2完全使用Promise并配合`async/await`来实现异步

* Koa与express
  * 同
    * 底层也都是共用的[同一套 HTTP 基础库](https://github.com/jshttp)
  * 异
    * 异步实现方式
      * ES5 VS （koa1:ES6/Generator+Promise、koa2:ES6/async+await）
    * 异常处理
      * 使用 try catch 就可以将按照规范编写的代码中的所有错误都捕获到。这样我们可以很便捷的编写一个自定义的错误处理中间件
    * 中间件机制
      * Koa用了洋葱圈模型。所有的请求经过一个中间件的时候都会执行两次，对比 Express 形式的中间件，Koa 的模型可以非常方便的实现后置处理逻辑
    * 新增全局对象 Context
      * Context上还挂载了 Request 和 Response两个对象
* Koa与Egg版本关系

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1547295040987-7cad6142-e18a-407f-8328-b4967577df88.png#align=left&display=inline&height=288&name=image.png&originHeight=576&originWidth=1780&size=119183&width=890)
> 1. koa2.x只支持node.js 8及以上版本
1. co的问题：性能损失、错误堆栈不友好。去co后性能30% up，错误堆栈更清晰

<a name="Chair"></a>
#### Chair
> chair 是蚂蚁基于node.js的koa框架开发的一套适用于 蚂蚁的后台开发框架 ，对应于sofa，chair的定位是轻量级，目前主要作用为bff中间层，对后端数据进行灵活地获取，组合，拆解，返回给前端。

<a name="Egg"></a>
#### Egg
>  Egg 继承于 Koa。  Egg 选择了 Koa 作为其基础框架，在它的模型基础上，进一步对它进行了一些增强。Egg 奉行「约定优于配置」的原则，亮点在其高可扩展性的「插件机制」。

<a name="BFF"></a>
#### BFF
> BFF 本质上讲的是一个后端中间层，用户体验适配层。但是它的作用主要是**适配前端不同的用户体验**（无线，桌面，智能终端等等），所以称为用户体验适配层。 理想情况下，后台提供的数据模型应该是通用的，细粒度的，充分考虑服务的稳定性，健壮性。而体验适配层则对后台的通用数据模型进行适当 的裁剪和格式化，以适应不同的用户体验展示的需要。对后台服务数据进行编排和预聚合，这样可以有效简化客户端逻辑和减少网络调用开销。


<a name="Egg"></a>
## Egg
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1548377242955-1d7152ac-5e22-429b-aaa9-360a29100430.png#align=left&display=inline&height=399&name=image.png&originHeight=399&originWidth=826&size=179987&width=826)
<a name="f3b8b53f"></a>
#### 上层框架
Egg 上层框架并没有这么特殊，只是一个插件的集合，选择使用什么插件就有框架开发者来决定。框架是一层抽象，可以基于 Egg 去封装上层框架，并且 Egg 支持多层继承。
> 我们不推荐应用开发者直接使用 egg ，而是要使用对应 BU 的上层框架。整个团队就可以遵循统一的方案，并且在项目中可以根据业务场景自行使用插件做差异化，当后者验证为最佳实践后，就能下沉到框架中，其他项目仅需简单的升级下框架的版本即可享受到。                                                                                      --Egg official

```
+-----------------------------------+--------+
|            app1, app2, app3       |        |
+-----------------------------------+        |
|  chair |  begg | @ali/nut | ...   |        |
+-----------------------------------+ plugin |
|                @ali/egg           |        |
+-----------------------------------+        |
|                 Egg.js            |        |
+-----------------------------------+--------|
|                egg-core                    |
+--------------------------------------------|
|                  Koa                       |
+--------------------------------------------+
```

<a name="c666ad11"></a>
### 特性
* 提供基于 Egg [定制 上层框架](https://eggjs.org/zh-cn/advanced/framework.html)的能力
* 高度可扩展的[ 插件机制](https://eggjs.org/zh-cn/basics/plugin.html) 
* 内置 [多进程 管理](https://eggjs.org/zh-cn/advanced/cluster-client.html)
* 基于 [Koa](http://koajs.com/) 开发，性能优异
* 框架稳定，测试覆盖率高
* [渐进式开发](https://eggjs.org/zh-cn/tutorials/progressive.html)
<a name="c64bb3f2"></a>
### 洋葱圈模型
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1548377293812-ef53caa3-4f55-40af-bf72-8a107e9125ca.png#align=left&display=inline&height=291&name=image.png&originHeight=435&originWidth=478&size=59343&width=320)
<a name="c9803f70"></a>
### 层次结构概览
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1548377329012-a16304d7-c701-47c1-b176-c94da0035c4c.png#align=left&display=inline&height=434&name=image.png&originHeight=866&originWidth=634&size=104577&width=318)
<a name="1c282501"></a>
### 异步编程模型
问题：嵌套回调、异步调同步数据不一致 => 方案。。 <br />    => Promise √ => ES6<br />    => co类库 √ => aysnc/await => ES2017
<a name="236b0cdd"></a>
### 插件
一个插件可以包含：
* extend：扩展基础对象的上下文，提供各种工具类、属性。
* middleware：增加一个或多个中间件，提供请求的前置、后置处理逻辑。
* config：配置各个环境下插件自身的默认配置项。

<a name="Helloworld"></a>
## Helloworld
<a name="static"></a>
### static
> Egg 内置了 [static](https://github.com/eggjs/egg-static) 插件，线上环境建议部署到 CDN，无需该插件。
> static 插件默认映射 `/public/* -> app/public/*` 目录

<a name="236b0cdd"></a>
### 插件
> Why插件？
> 我们在使用 Koa 中间件过程中发现了下面一些问题：
> 1. 顺序管理。中间件加载其实是有先后顺序的，但是中间件自身却无法管理这种顺序，只能交给使用者。这样其实非常不友好，一旦顺序不对，结果可能有天壤之别。
1. 中间件指责之外的处理。中间件的定位是拦截用户请求，并在它前后做一些事情，例如：鉴权、安全检查、访问日志等等。但实际情况是，有些功能是和请求无关的，例如：定时任务、消息订阅、后台逻辑等等。
1. 复杂的框架初始化。有些功能包含非常复杂的初始化逻辑，需要在应用启动的时候完成。这显然也不适合放到中间件中去实现。
> 
综上所述，我们需要一套更加强大的机制，来管理、编排那些相对独立的业务逻辑。

可以用于用户对Egg进行自定义配置，处理Egg实例自身。如View中根据使用习惯使用不同的模版引擎。<br />三步： 安装 -> 在 config/plugin 对插件进行声明（实例化）  -> 在 config/default 中对插件进行引用声明<br />⚠️**只能在应用层使用，在框架层请勿使用。**
<a name="2dc90225"></a>
### 扩展
对外部/内部 工具库/工具函数 的内部封装与引用：1.对上层屏蔽工具方法的实现细节及差异；2.复用外部的轮子的同时遵循内部统一的规范<br />对比上下： 功能级、细粒度
<a name="3cbfec33"></a>
### 中间件
> **中间件的定位是拦截用户请求，并在它前后做一些事情**

为Egg定制的，拦截器、功能增强集等，需要依赖Egg中的环境信息。如根据请求上下文自动拦截百度爬虫的访问。
<a name="977b76a8"></a>
### 插件、扩展、中间件
* 插件     -> 配置自身
* 扩展     -> 补充or增强自身
* 中间件 -> 协同外部、拦截器等
> <a name="3f330575"></a>
#### 中间件、插件、应用的关系
> **一个插件其实就是一个『迷你的应用』，和应用（app）几乎一样**：
> * 它包含了 [Service](https://eggjs.org/zh-cn/basics/service.html)、[中间件](https://eggjs.org/zh-cn/basics/middleware.html)、[配置](https://eggjs.org/zh-cn/basics/config.html)、[框架扩展](https://eggjs.org/zh-cn/basics/extend.html)等等。
* 它没有独立的 [Router](https://eggjs.org/zh-cn/basics/router.html) 和 [Controller](https://eggjs.org/zh-cn/basics/controller.html)。
* 它没有 `plugin.js`，只能声明跟其他插件的依赖，而**不能决定**其他插件的开启与否。
> 
他们的关系是：
> * 应用可以直接引入 Koa 的中间件。
* 当遇到上一节提到的场景时，则应用需引入插件。
* 插件本身可以包含中间件。
* 多个插件可以包装为一个[上层框架](https://eggjs.org/zh-cn/advanced/framework.html)。

<a name="15c64aa0"></a>
### 配置文件
**应用/插件/中间件/框架 **都可以配置自己的配置文件，框架将按顺序合并加载<br /><br />
<a name="5de68336"></a>
## 框架内置基础对象
```
{
  koa: [Application, Context, Request, Response],     // 继承自 koa
  own: [Controller, Service, Helper, Config, Logger], // 自身扩展
}
```
<a name="Application"></a>
### Application
> 全局应用对象，在一个应用中，只会实例化一个。在它上面可以挂载一些全局的方法和对象。Application 对象几乎可以在编写应用时的任何一个地方获取到！

* 事件/钩子： [ server, error, request, response ]
<a name="Context"></a>
### Context
> 请求级的对象。每一次收到用户请求时，框架会实例化一个 Context 对象，这个对象封装了这次用户请求的信息，并提供了许多便捷的方法来获取请求参数或者设置响应信息。Context会被挂在到Appliction上。

* 使用
  * in Middleware
    * koa v1: this.query
    * koa v2: arguments[0]....
  * in Controller
    * lue
  * in Service
    * lue
  * 非用户请求的场景
    *  有些非用户请求的场景下需要访问 service / model 等 Context 实例上的对象，我们可以通过 `Application.createAnonymousContext()` 方法创建一个匿名 Context 实例
  * in schedule(定时任务)
    * arguments[0].....
<a name="dc66e209"></a>
### Request/Response
> 请求级  的对象。封装了 Node.js 原生的 HTTP Request/Response 对象，提供了一系列辅助方法获取 HTTP 请求常用参数。

* 使用
  * **一般使用**：ctx.request / ctx.response
  * **快捷接口**：koa 会在 Context 上代理一部分 Request 和 Response 上的方法和属性
  * ⚠️**请求体**：获取 POST 的 body 应该使用 `ctx.request.body`，而不是 `ctx.body` 即消息体没有被代理
<a name="Controller"></a>
### Controller
> 框架提供了一个 Controller 基类，并推荐所有的 [Controller](https://eggjs.org/zh-cn/basics/controller.html) 都继承于该基类实现。

```
// 内置Controller基类的属性
{
  ctx:     // 当前请求的 Context 实例
  app:     // 应用的 Application 实例
  config:  // 应用的配置
  service: // 应用所有的service
  logger:  // 为当前controller封装的logger对象
}
```
* 使用：两种方式（略）
<a name="Service"></a>
### Service
> 框架提供了一个 Service 基类，并推荐所有的 Service 都继承于该基类实现。

* 使用：两种方式（略）
<a name="Helper"></a>
### Helper
> 工具函数。每次请求时会进行实例化，因此Helper上的所有函数能获取到当前请求对象的上下文信息。

* 使用：1. 上下文对象中；2. Helper 的实例还可以在模板中获取到
* **自定义**：通过 框架扩展extend 的形式来自定义。
<a name="Config"></a>
### Config
> 推荐应用开发遵循配置和代码分离的原则，将一些需要硬编码的业务配置都放到配置文件中，同时配置文件支持各个不同的运行环境使用不同的配置。

* **使用**：方式1. 通过 `app.config` 从 Application 实例上获取到 config 对象；方式2. 也可以在 Controller, Service, Helper 的实例上通过 `this.config` 获取到 config 对象。
<a name="Logger"></a>
### Logger
```
// 四种Logger类型
[ logger.debug(), logger.info(), logger.warn(), logger.error() ]

// 六种Logger级别
[
 App Logger,          // 应用级，4业务开发
 App CoreLogger,      // 应用级，4框架开发
 Context Logger,      // 请求级，可获取框架格式化的请求信息，4业务开发
 Context CoreLogger,  // 请求级，可获取框架格式化的请求信息，4插件开发
 Controller Logger,   // 本质上时Context Logger，会增加文件路径等信息 
 Service Logger,      // 本质上时Context Logger，会增加文件路径等信息 
]
```
<a name="d41d8cd9"></a>
## 
<a name="8efeb485"></a>
## 框架内置增强对象
<a name="Subscription"></a>
### Subscription
> 订阅模型是一种比较常见的开发模式，譬如消息中间件的消费者或调度任务，Egg提供了 Subscription 基类来规范化这个模式

<br />
<a name="158744a8"></a>
## 运行环境
> 一个 Web 应用本身应该是无状态的，并拥有根据运行环境设置自身的能力。在 Koa 中通过 `app.env` 来进行环境判断，`app.env` 默认的值是 `process.env.NODE_ENV`。但是在 Egg（和基于 Egg 的框架）中，配置统一都放置在 `app.config` 上，所以需要通过 `app.config.env` 来区分环境，`app.env` 不再使用


<a name="224e2ccd"></a>
## 配置
Egg中的配置管理十分灵活：1. 区分 应用>框架>插件 等不同级别，顺序覆盖；2. 区分 开发/测试/生产 等不同类型。<br />合并后的配置可直接从 `app.config` 获取。
> 当指定 env 时会同时加载对应的配置文件，并覆盖默认配置文件的同名配置。如 `prod` 环境会加载 `config.prod.js` 和 `config.default.js` 文件，`config.prod.js` 会覆盖 `config.default.js` 的同名配置。

支持配置文件返回一个方法。
> // 配置结果输出
> 框架在启动时会把合并后的最终配置 dump 到 `run/application_config.json`（worker 进程）和 `run/agent_config.json`（agent 进程）中，可以用来分析问题。

<a name="3cbfec33"></a>
## 中间件
>  Egg 是基于 Koa 实现的，所以 Egg 的中间件形式和 Koa 的中间件形式是一样的，都是基于[洋葱圈模型](https://eggjs.org/zh-cn/intro/egg-and-koa.html#midlleware)。每次编写一个中间件，就相当于在洋葱外面包了一层。

* 定义：
  * 用户自定义：略
  * 外部中间件库： `app.use(...)` ，⚠️**可在应用中进行归一化**
  * Egg框架内置（可修改配置，进行细节配置）

           ⚠️**框架和插件加载的中间件会在应用层配置的中间件之前，框架默认中间件不能被应用层中间件覆盖，如果应用层有自定义同名中间件，在启动时会报错。**
* 使用(需要手动挂载)：

使用场景 | 关键对象 | 作用范围<br />----- | ----  | -----<br />在应用中使用中间件   |  `app.config.appMiddleware`   | 全局、处理每次请求<br />在框架和插件中使用中间件   |  `app.config.coreMiddleware`   | 全局、处理每次请求<br />在router中使用中间件   |  app.middleware...(in app/router.js)  | 对单个路由生效
* 通用配置
```
// both inner and outter items will applicate
{
  enable：控制中间件是否开启。
  match：设置只有符合某些规则的请求才会经过这个中间件。
  ignore：设置符合某些规则的请求不经过这个中间件。
}
```

<a name="1804f55a"></a>
## 浏览器请求处理流程
浏览器request -> （反向代理）-> 路由  -> 中间件(http parsers) ->  控制器  -> 校验器  -> service -> 浏览器 response
* request parse
* response format: 支持流式结果返回
<a name="75fc7de7"></a>
## 路由
* restful规则
* 重定向
  * 内部重定向：route中静态配置
  * 外部重定向：代码中根据条件动态调用 `ctx.redirect`
> ⚠️我们并不建议把路由规则逻辑散落在多个地方，会给排查问题带来困扰

<a name="ac341bea"></a>
## 控制器
<a name="9c1abad1"></a>
### http内容
* json*
* file / file*（文件）=> 框架+自定义级的文件格式白名单控制
* stream（文件）    => 框架+自定义级的文件格式白名单控制
* jsonp
  * 公开数据的读
  * 敏感数据的读 => 需要开启csrf 保证安全 
  * 写                 => 需要开启csrf 保证安全
<a name="5bfc0e23"></a>
### http参数解析
* post / put / ... 请求
> 框架内置了 [**bodyParser**](https://github.com/koajs/bodyparser)** 中间件 **来对这两类格式的请求 body 解析成 object 挂载到 `ctx.request.body` 上。

  * body 中内容的大小有上限控制，可通过配置控制值
  * 如果有反向代理，反向代理中的上限需要同控制器中的配置保持一致
  * 一个常见的错误是把 `ctx.request.body` 和 `ctx.body` 混淆，后者其实是 `ctx.response.body` 的简写
* get / head 请求
> HTTP 协议中并不建议在通过 GET、HEAD 方法访问时传递 body，所以我们无法在 GET、HEAD 方法中按照此方法获取到内容。

<a name="47d68cd0"></a>
## 服务
> Service 就是在复杂业务场景下用于做业务逻辑封装的一个抽象层

* 抽离 Controller中的业务逻辑，使其指责单一
* 便于复用
* 便于测试
* 懒加载，调用时相应的才service才会被实例化

<a name="236b0cdd"></a>
## 插件

<a name="a1bd9760"></a>
## 定时任务
> 所有的定时任务都统一存放在 `app/schedule` 目录下，每一个文件都是一个独立的定时任务，可以配置定时任务的属性和要执行的方法。

* 定时方式
  * 普通
  * cron
* 定时任务类型
  * worker: 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
  * all: 每台机器上的每个 worker 都会执行这个定时任务
* 任务日志
> 执行日志会输出到 `${appInfo.root}/logs/{app_name}/egg-schedule.log`，默认不会输出到控制台，可以通过 `config.customLogger.scheduleLogger` 来自定义

* 参数可配置、支持动态
* 可手动启用
* 可扩展

<a name="98c6a0c3"></a>
## 框架扩展
* 框架提供了多种扩展点扩展自身的功能：[ Application, Context, Request, Response, Helper ]
* 还可以根据环境进行有选择的扩展。对于 Application，Context，Request，Response，Helper 都可以使用这种方式针对某个环境进行扩展。

<br />
<a name="cc6f8604"></a>
## 启动自定义
**配置即将加载 -> 配置加载完成 -> 文件加载完成 -> 插件启动 -> worker -> 启动完成 -> 将关闭**
> 常常需要在应用启动期间进行一些初始化工作，等初始化完成后应用才可以启动成功，并开始对外提供服务。
> 框架提供了统一的入口文件（`app.js`）进行启动过程自定义，这个文件返回一个 Boot 类，我们可以通过定义 Boot 类中的生命周期方法来执行启动应用过程中的初始化工作。
> 框架提供了这些 [生命周期函数](https://eggjs.org/zh-cn/advanced/loader.html#life-cycles)供开发人员处理：
> * 配置文件即将加载，这是最后动态修改配置的时机（`configWillLoad`）
* 配置文件加载完成（`configDidLoad`）
* 文件加载完成（`didLoad`）
* 插件启动完毕（`willReady`）
* worker 准备就绪（`didReady`）
* 应用启动完成（`serverDidReady`）
* 应用即将关闭（`beforeClose`）

⚠️**在自定义生命周期函数中不建议做太耗时的操作，框架会有启动的超时检测**<br />**
<a name="83120c8a"></a>
## 渐进式开发
* 业务功能模块
* 本地lib（类插件目录规范）
* 外置独立于业务项目，publish前通过 tnpm link
* publish后用package的包引用方式

<a name="5f24ae22"></a>
## Cookie & Session
> Session可存储于cookie之外 ----------------

**⚠️一旦选择了将 Session 存入到外部存储中，就意味着系统将强依赖于这个外部存储，当它挂了的时候，我们就完全无法使用 Session 相关的功能了。因此我们更推荐大家只将必要的信息存储在 Session 中，保持 Session 的精简并使用默认的 Cookie 存储，用户级别的缓存不要存储在 Session 中。**
* session失效时间，“记住我”功能通过maxAge实现
* 可通过renew 延长，在发现当用户 Session 的有效期仅剩下最大有效期一半的时候，重置 Session 的有效期 

<br />
<a name="482df188"></a>
# ***多进程模型和进程间通讯***
JavaScript 代码是运行在单线程上的，换句话说一个 Node.js 进程只能运行在一个 CPU 上。那么如果用 Node.js 来做 Web Server，就无法享受到多核运算的好处。如何榨干服务器资源，利用上多核 CPU 的并发优势？<br /> Node.js 官方提供的解决方案是 [Cluster 模块](https://nodejs.org/api/cluster.html)，其中包含一段简介：
> 单个 Node.js 实例在单线程环境下运行。为了更好地利用多核环境，用户希望**启动一批 Node.js 进程**用于加载。
> 集群化模块使得你很方便地创建子进程，以便于在服务端口之间共享。

<a name="9367fb41"></a>
### Node应用中的进程类型
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1547603806785-0e896f03-ceb3-40b9-bc68-ee8566c088c2.png#align=left&display=inline&height=198&name=image.png&originHeight=396&originWidth=1536&size=96100&width=768)
<a name="81adf755"></a>
## Cluster 是什么?
**模式：一个Master+多个Worker，前者只负责启动和调度后者，worker数对应CPU核数，需要保证在线的『工人』总数不变（包括存在worker异常退出时启动新增等） ********
* 在服务器上**同时启动多个进程**。
* 每个进程里都跑的是**同一份源代码**（好比把以前一个进程的工作分给多个进程去做）。
* 更神奇的是，这些进程可以**同时监听一个端口**

其中：
* 负责启动其他进程的叫做 Master 进程，他好比是个『包工头』，不做具体的工作，只负责启动其他进程。
* 其他被启动的叫 Worker 进程，顾名思义就是干活的『工人』。它们接收请求，对外提供服务。
* Worker 进程的数量一般根据服务器的 CPU 核数来定，这样就可以完美利用多核资源。
<a name="b9b1a139"></a>
### Node进程的退出
<a name="09e803ec"></a>
#### 未捕获异常：
 关闭异常 Worker 进程所有的 TCP Server，断开和 Master 的 IPC 通道  ->  Master 立刻 fork 一个新的 Worker 进程 -> 异常 Worker 等待一段时间，处理完已经接受的请求后退出
<a name="57a3f885"></a>
#### OOM、系统异常
而当一个进程出现异常导致 crash 或者 OOM 被系统杀死时，不像未捕获异常发生时我们还有机会让进程继续执行，只能够让当前进程直接退出，Master 立刻 fork 一个新的 Worker
<a name="f050a2e1"></a>
### 进程模型升级
<a name="3507d2f3"></a>
#### Agent机制
> 对于这一类**后台**运行的逻辑，我们希望将它们放到一个单独的进程上去执行，这个进程就叫 Agent Worker，简称 Agent。Agent 好比是 Master 给其他 Worker 请的一个『秘书』，它**不对外提供服务，只给 App Worker 打工，专门处理一些公共事务**。

<a name="0aa66e80"></a>
#### 启动流程
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1547603530774-a792c6c6-eb38-44d1-9e78-0c2a2c0b0e8e.png#align=left&display=inline&height=304&name=image.png&originHeight=608&originWidth=868&size=57536&width=434)
1. Master 启动后先 fork Agent 进程
1. Agent 初始化成功后，通过 IPC 通道通知 Master
1. Master 再 fork 多个 App Worker
1. App Worker 初始化成功，通知 Master
1. 所有的进程初始化成功后，Master 通知 Agent 和 Worker 应用启动成功
<a name="b22988ac"></a>
#### Worker & Agent
⚠️注意点：
1. 由于 App Worker 依赖于 Agent，所以必须等 Agent 初始化完成后才能 fork App Worker
1. Agent 虽然是 App Worker 的『小秘』，但是业务相关的工作不应该放到 Agent 上去做，不然把她累垮了就不好了
1. 由于 Agent 的特殊定位，**我们应该保证它相对稳定**。当它发生未捕获异常，框架不会像 App Worker 一样让他退出重启，而是记录异常日志、报警等待人工处理
1. Agent 和普通 App Worker 挂载的 API 不完全一样
<a name="fa87f16f"></a>
#### 进程间通讯（IPC）
 cluster 的 IPC 通道只存在于 Master 和 Worker/Agent 之间，Worker 与 Agent 进程互相间是没有的,只能通过 Master 来转发。<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1547686581931-ed70f769-3068-4cdb-958a-fc899234cc26.png#align=left&display=inline&height=424&name=image.png&originHeight=976&originWidth=776&size=92575&width=337)
> 需要等 `egg-ready` 消息之后才能发送消息。只有在 Master 确认所有的 Agent 进程和 Worker 进程都已经成功启动（并 ready）之后

<a name="6973175a"></a>
## 异常捕获
⚠️`setImmediate` 等『跳出』异步链的情况，这时它里面的错误就无法被捕捉到了。<br />解决： 这类场景，提供了 `ctx.runInBackground(scope)` 辅助方法，通过它又包装了一个异步链，所有在这个 scope 里面的错误都会统一捕获。<br /><br />
<a name="e1373738"></a>
# 多进程研发模式（Agent处理长链接对资源的消耗机制）
> 背景：
> 服务端来说是非常宝贵的资源，一台服务器最好只建立一个长连接 => 尽可能的复用长连接，会把它放到 Agent 进程里维护，然后通过 messenger 将数据传递给各个 Worker => 问题：需要写大量代码去封装接口和实现数据的传递+通过 messenger 传递数据效率是比较低
> 解法：
> 通过建立 Agent 和 Worker 的 socket 直连跳过 Master 的中转。Agent 作为对外的门面维持多个 Worker 进程的共享连接。
> * 框架启动的时候 Master 会随机选择一个可用的端口作为 Cluster Client 监听的通讯端口，并将它通过参数传递给 Agent 和 App Worker。
* Leader 和 Follower 之间通过 socket 直连（通过通讯端口），不再需要 Master 中转。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1547897313894-0c584243-4414-4e38-a469-5a14594e461f.png#align=left&display=inline&height=216&name=image.png&originHeight=412&originWidth=614&size=31689&width=322)  =>  ![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1547897348669-ab492531-7f4b-43ca-af4c-0ee775e614f5.png#align=left&display=inline&height=218&name=image.png&originHeight=612&originWidth=892&size=60094&width=318)

<a name="1bbfa978"></a>
###  [Leader/Follower](http://www.cs.wustl.edu/~schmidt/PDF/lf.pdf) 模式
> 客户端会被区分为两种角色：Leader & Follower
> Leader or Follower： 自由竞争模式、强制指定模式

<a name="694ad362"></a>
### 客户端类型抽象
客户端接口可以抽象为两类：
* 订阅、发布类（subscribe / publish）：
* 调用类 (invoke)，支持 callback, promise 和 generator function 三种风格的接口，但是推荐使用 generator function。
<a name="e449cf10"></a>
#### 异常处理
* Leader 如果“死掉”会触发新一轮的端口争夺
* 为保证 Leader 和 Follower 之间的通道健康，需要引入定时心跳检查机制，如果 Follower 在固定时间内没有发送心跳包，那么 Leader 会将 Follower 主动断开，从而触发 Follower 的重新初始化。
<a name="ea67d33f"></a>
#### 调用时序
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1547898047049-4a288a7e-970d-47de-9dfc-49e30d7376ec.png#align=left&display=inline&height=295&name=image.png&originHeight=748&originWidth=996&size=64705&width=393)
<a name="9187820b"></a>
### APIClient同步&异步
* 异步数据获取，通过调用基于 `ClusterClient` 的 `RegistryClient` 的 API 实现。
* 同步调用等与服务端无关的接口在 `APIClient` 上实现。由于 `ClusterClient` 的 API 已经抹平了多进程差异，所以在开发 `APIClient` 调用到 `RegistryClient` 时也无需关心多进程模型。
  * RegistryClient - 负责和远端服务通讯，实现数据的存取，只支持异步 API，不关心多进程模型。
  * ClusterClient - 通过 `cluster-client` 模块进行简单 wrap 得到的 client 实例，负责自动抹平多进程模型的差异。
  * APIClient - 内部调用 `ClusterClient` 做数据同步，无需关心多进程模型，用户最终使用的模块。API 都通过此处暴露，支持同步和异步。

<a name="Refs"></a>
## Refs
* [express](http://www.expressjs.com.cn/)
* [koa官方](https://koajs.com/)
* [koa by 廖雪峰](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434501579966ab03decb0dd246e1a6799dd653a15e1b000)
* [chair官网](http://chair.alibaba-inc.com/)
* [egg官网](https://eggjs.org/zh-cn/)
* [「精品」蚂蚁中台研发入门手册](https://yuque.antfin-inc.com/afx-es/ffb/yda8da#lnxaib) BFF与chair与egg
* [Node.js 阿里手册](https://yuque.antfin-inc.com/alinode/handbook)
* [七天学会NodeJS](http://nqdeng.github.io/7-days-nodejs/)
* 生产中[常用的配置管理方案](https://eggjs.org/zh-cn/basics/config.html)
* [web安全](https://eggjs.org/zh-cn/core/security.html#%E5%AE%89%E5%85%A8%E5%A8%81%E8%83%81csrf%E7%9A%84%E9%98%B2%E8%8C%83)
* [Cluster 实现原理](https://cnodejs.org/topic/56e84480833b7c8a0492e20c)
* [图解正向代理、反向代理、透明代理](https://www.cnblogs.com/lin3615/p/5653234.html)
* [结合源码解密egg运行原理](https://github.com/sunshinewyf/issue-blog/issues/30)
* [Egg & Node.js 从小工坊走向企业级开发](https://github.com/atian25/blog/issues/20)
* [egg实战](http://gitlab.alibaba-inc.com/node/team/blob/master/web.md)
* [Egg源码研究](https://yuque.antfin-inc.com/chenglin.mcl/process/yhfn2t)

<a name="Next"></a>
## Next
* [https://eggjs.org/zh-cn/intro/quickstart.html](https://eggjs.org/zh-cn/intro/quickstart.html)
<a name="d41d8cd9"></a>
## 
<br />