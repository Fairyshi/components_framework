# node中的五类dependency

node项目 `package.json` 中的依赖包有五类 `dependencies`、`devDependencies`、`peerDependencies`、`bundleDependencies`、`optionalDependencies`，其中前三中较常用。在此记录下各类的使用及异同。

<a name="a837qx"></a>
## [](#a837qx)栗子
```
// project dir tree(the project ref package-a、package-b、package-d)

├── project-main
    ├── package-a (dependency)
    │   └── package-a-1 (devDependency)
    │   └── package-d (peerDependency)
    ├── package-b (dependency)
    │   └── package-b-1 (devDependency)
    │   └── package-d (peerDependency)
    └── package-c (devDependency)
```

```
// package.json
{
  "name": "project-main",
  "dependencies": {
    "package-a": "^1.0.0",
    "package-b": "^1.0.0",
    "package-d": "^1.0.0",
  },
  "devDependencies": {
    "package-c": "^1.0.0"
  }
}
```

<a name="eg78km"></a>
### [](#eg78km)install result
<a name="i3fqvq"></a>
#### [](#i3fqvq)npm install
```
// project dir tree

├── project-main
  |-- node_modules
  |    ├── package-a 
  |    ├── package-b 
  |    └── package-c 
  |    └── package-d
```
<a name="53wbhr"></a>
#### [](#53wbhr)npm install --production
```
// project dir tree

├── project-main
  |-- node_modules
  |    ├── package-a 
  |    ├── package-b 
  |    └── package-d
```

<a name="articleHeader0"></a>
### [](#articleHeader0)dependency 与 devDependency 的异同
|  | devDependency | devDependency |
| --- | --- | --- |
| 安装 | `npm install --save`  | `npm install --save-dev`  |
| `package.json` 中声明 | `dependencies: {}`   中 | `devDependencies: {}`  中 |
| 使用 | 生产环境，正式运行需要用到时 | 做 测试、打包、ES6转ES5类时 |

<a name="articleHeader1"></a>
### [](#articleHeader1)peerDependencies
以上栗子中将 `project-main` 看成是 `package-a` `package-b` 的宿主环境，如果 `npm install` 时 该宿主环境中没有上述两个依赖包申明的 `peer-dependency`  `package-d`，控制台就会告警 UNMET PEER DEPENDENCY package-d@^1.0.0。一般会将一些很通用的包或插件申明为 `peer-dependency` ，避免在宿主环境中的不同依赖中均引用到但版本不一致时在宿主环境中出现版本不一致的冲突。

<a name="articleHeader3"></a>
### [](#articleHeader3)bundleDependencies
将所声明的依赖包汇总到该包自身的 `node_modules`  下，便于用户管理
```
{
  "name": "package-a",
  "dependencies": {
    "react": "^15.0.0",
    "core-js": "^2.0.0",
    "lodash": "^4.0.0"
  },
}
```

安装后 `node_modules` 目录结构如下

```
├── node_modules
    ├── package-a
    ├── react
    ├── core-js
    └── loadsh
```

```
{
  "name": "package-a",
  "dependencies": {
    "react": "^15.0.0",
    "core-js": "^2.0.0",
    "lodash": "^4.0.0"
  },
  "bundleDependencies": [
    "react",
    "core-js"
  ]
}
```

安装后 `node_modules` 目录结构如下
```
├── node_modules
    ├── package-a
    │   └── react
    │   └── core-js
    └── loadsh
```

<a name="articleHeader4"></a>
### [](#articleHeader4)optionalDependencies
项目依赖了一个包 package-optional，假如这个 package-optional 没有安装，仍然想让程序正常执行就使用 `optionalDependncies`  ，optionalDependencies 跟 dependencies 声明方式完全一致，而且一个依赖如果同时在 dependencies 和 optionalDependencies 中声明，option 还会_覆盖_ dependency 的声明。如果 package-optional 这个包是可选的，在代码中就可以这样写了：

```
try {
    var pkgOpt = require('package-optional');
} catch (e) {
    pkgOpt = null;
}
console.log(pkgOpt);
```

