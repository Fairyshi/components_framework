# jz-collapse
---

collapse ui component for react

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]


## Screenshots

<img src="" width="400"/>

## Feature

* Support all popular browsers, including Internet Explorer 9 and above.

## Example

http://localhost:8040/examples/
(http://localhost:8040/examples/basic.html)

online example: http://react-component.github.io/collapse/examples/  

## install

[![jz-collapse](https://nodei.co/npm/jz-collapse.png)](https://npmjs.org/package/jz-collapse)

## Usage

see examples

## API

### CollapseMonitor props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
| status | collapse or uncollapse | String | Collapse.COLLAPSE_STATUS.CLOSE |
| openKeys | array of children order on close status | numbser[], required | null |
| children | React.Children | React Components, required | null |
| openIcon | open trigger | React Component, optional | null |
| closeIcon | close trigger | React Component, optional | null |

## note

Here is the description.


## Development

```
npm install
npm start
```

## Demo
http://localhost:8040/examples/basic.html

## Test Case
http://localhost:8040/tests/runner.html?coverage

## Coverage

http://localhost:8040/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8040/tests/runner.html?coverage

## License
jz-collapse is released under the MIT license.

## other collapse view
- [zcollapse]()
