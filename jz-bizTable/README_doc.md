# jz-bizTable
---

bizTable ui component for react

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]


## Screenshots
<img src="./assets/biztable" width="400"/>

## Feature

* Support all popular browsers, including Internet Explorer 9 and above.

## Example
http://localhost:8039/examples/
(http://localhost:8039/examples/basic.html)

online example: http://react-component.github.io/bizTable/examples/  

## install

[![jz-bizTable](https://nodei.co/npm/jz-bizTable.png)](https://npmjs.org/package/jz-bizTable)

## Usage

see examples

## API

### BizTableMonitor props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
| prefixClx | prefix class | String | 'bizTable' |
| columns | columns to antd-table with the optional _config options in column | array | [] |
| dataSource | passed to antd-table | array | [] |
| config | fetch params initially | { namespace, dispatch, effect } | { effect: 'masterList' } |
| Link | component for href in column._config | React.Component | a |

### column._config props
| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
| prefix | prefix of column content | node | null |
| prefixColor | color name of the prefix color dot in column | 'string' | null |
| suffix | suffix of column content | node | null |
| clipboard | has clipboard as suffix in column | boolean | false |
| href | href source, content shown as a or a-like in column  | string or function | null |
| suffix | textAlign of the column content is right | node | false |
| ellipsis | column content keeps oneline(overflow ellipsis) | number | undefined |
| multiEllipsis | max rows of the column, overflow ellipsis | number | undefined |
| format | format the column content text with matched formatter | string | null |

#### available column._config.format value
| name     | description    |
|----------|----------------|
| percentage | format column text to percentage |
| float | format column text to float |
| integer | format column text to integer |
| date | format column text to date |
| time | format column text to time |

## note
Here is the description.


## Development
```
npm install
npm start
```

## Demo
http://localhost:8039/examples/basic.html

## Test Case
http://localhost:8039/tests/runner.html?coverage

## Coverage

http://localhost:8039/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8039/tests/runner.html?coverage

## License
jz-bizTable is released under the MIT license.

## other bizTable view
- [zbizTable]()

## Steps
- clone this repository
- cd jz-BizTable
- git remote remove origin
- git remote add origin git@... // your new repository name
- update global port (8039 to a new one for local conflict)
- ... biz ...
