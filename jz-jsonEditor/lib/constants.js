'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var KEY_IN_STORE = exports.KEY_IN_STORE = 'jsonEditor';
var JSON_EDITOR_EVENT = exports.JSON_EDITOR_EVENT = 'jsonEditorEvent';
var JSON_EDITED_EVENT = exports.JSON_EDITED_EVENT = 'jsonEditedEvent';

var MODE = exports.MODE = {
  PAGE: 'PAGE',
  COMPONENT: 'COMPONENT'
};

var EDITOR_PANEL_STATUS = exports.EDITOR_PANEL_STATUS = {
  close: 'close',
  open: 'open'
};

var OPER_TYPE = exports.OPER_TYPE = {
  ADD: 'ADD',
  DELETE: 'DELETE',
  EDIT: 'EDIT'
};

var EDITOR_STYLE = exports.EDITOR_STYLE = {
  padding: '10px',
  borderRadius: '3px',
  margin: '10px 0px'
};

var JSON_EDITOR_CONFIG = exports.JSON_EDITOR_CONFIG = {
  theme: 'isotope', // monokai
  src: null,
  collapsed: false,
  collapseStringsAfter: 15,
  onAdd: true,
  onEdit: true,
  onDelete: true,
  displayObjectSize: true,
  enableClipboard: true,
  indentWidth: 4,
  displayDataTypes: true,
  iconStyle: 'triangle',
  style: EDITOR_STYLE
};

var I18N = exports.I18N = {
  label: {
    theme: '主题',
    collapsed: '收起',
    collapseStringsAfter: '最长字符数',
    displayObjectSize: '显示对象大小',
    enableClipboard: '可编辑',
    indentWidth: '前缀空格数',
    displayDataTypes: '显示数据类型',
    iconStyle: '图标'
  },
  toolbox: {
    title: '编辑器设置'
  },
  themes: [{ value: 'apathy', label: 'apathy' }, { value: 'ashes', label: 'ashes' }, { value: 'bespin', label: 'bespin' }, { value: 'brewer', label: 'brewer' }, { value: 'bright', label: 'bright' }, { value: 'chalk', label: 'chalk' }, { value: 'colors', label: 'colors' }, { value: 'eighties', label: 'eighties' }, { value: 'embers', label: 'embers' }, { value: 'flat', label: 'flat' }, { value: 'google', label: 'google' }, { value: 'grayscale', label: 'grayscale' }, { value: 'harmonic', label: 'harmonic' }, { value: 'hopscotch', label: 'hopscotch' }, { value: 'isotope', label: 'isotope' }, { value: 'marrakesh', label: 'marrakesh' }, { value: 'mocha', label: 'mocha' }, { value: 'monokai', label: 'monokai' }, { value: 'ocean', label: 'ocean' }, { value: 'paraiso', label: 'paraiso' }, { value: 'pop', label: 'pop' }, { value: 'railscasts', label: 'railscasts' }, { value: 'rjv-default', label: 'rjv-default' }, { value: 'shapeshifter', label: 'shapeshifter' }, { value: 'solarized', label: 'solarized' }, { value: 'summerfruit', label: 'summerfruit' }, { value: 'tomorrow', label: 'tomorrow' }, { value: 'tube', label: 'tube' }, { value: 'twilight', label: 'twilight' }],
  iconStyles: [{ value: 'triangle', label: '三角形' }, { value: 'square', label: '正方形' }, { value: 'circle', label: '圆形' }]
};