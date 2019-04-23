import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {MODE, I18N} from '../../../constants';

// Toolbar中的 item
import Theme from './Theme';
import Collapsed from './Collapsed';
import EnableClipboard from './EnableClipboard';
import CollapseStringsAfter from './CollapseStringsAfter';
import IconStyle from './IconStyle';
import IndentWidth from './IndentWidth';
import DisplayDataTypes from './DisplayDataTypes';
/* FILEINPUT,
  FILEOUTPUT, */

const MODE_TOOLTYPE_COMMON = [
  'theme', 'collapsed', 'enableClipboard', 'collapseStringsAfter',
  'iconStyle', 'indentWidth', 'displayDataTypes'
];
const MODE_TOOLTYPE = {
  COMPONENT: MODE_TOOLTYPE_COMMON,
  PAGE: [...MODE_TOOLTYPE_COMMON] /* MODE_TOOLTYPE_COMMON.concat([FILEINPUT, FILEOUTPUT]) */,
};
const STR_COMPONENT = {
  theme: Theme,
  collapsed: Collapsed,
  enableClipboard: EnableClipboard,
  collapseStringsAfter: CollapseStringsAfter,
  enableClipboard: EnableClipboard,
  iconStyle: IconStyle,
  indentWidth: IndentWidth,
  displayDataTypes: DisplayDataTypes,
};
const SORT_SQUENCE = [
  'theme', 'iconStyle', 'indentWidth', 'collapseStringsAfter', 
  'collapsed', 'displayDataTypes', 'enableClipboard',
];
export default class ToolbarController extends PureComponent {
  static propTypes = {
    mode: PropTypes.string,
    data: PropTypes.object,
    onChange: PropTypes.func,
  };

  change = type => value => {
    const {data, onChange} = this.props;
    const newData = {...data, [type]: value};
    onChange(newData);
  };

  render() {
    const {mode, data} = this.props;
    const tooltypes = MODE_TOOLTYPE[mode];

    return (
      <div className="json-editor-toolbar">
        <div className="json-editor-toolbar-inner">
          <div className="json-toolbox-title">{I18N.toolbox.title}</div>
          <ul> {
            Object.keys(data)
              .filter(type => tooltypes.includes(type))
              .sort((a, b) => {
                return SORT_SQUENCE.indexOf(a) > SORT_SQUENCE.indexOf(b);
              })
              .map(type => {
                const value = data[type];
                const Comp = STR_COMPONENT[type];
                const key = `toolbox-item-${type}`;
                return <li key={key}><Comp value={value} onChange={this.change(type)} /></li>;
              })
          } </ul>
        </div>
      </div>
    );
  }
}
