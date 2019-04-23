import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import _ from 'lodash';
import {Icon} from 'antd';
import { emitter } from '../index';
import {addListenerOnce} from '../../../util';
import { JSON_EDITOR_EVENT, JSON_EDITED_EVENT } from '../../../constants';

export default class  EditTigger extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    currentKey: PropTypes.string,
    data: PropTypes.objectOf(PropTypes.any),
  };

  componentDidMount() {
    this.watchEditorEvent();
  }

  watchEditorEvent = () => {
    const {onChange} = this.props;
    // JSON编辑器编辑完成后json变化触发
    addListenerOnce(JSON_EDITED_EVENT, jsonInfo => {
      if (_.isFunction(onChange)) {
        onChange(jsonInfo);
      }
    });
  }

  handleClick = () => {
    const {currentKey, data} = this.props;
    emitter.emit(JSON_EDITOR_EVENT, {[currentKey]: data});
  };

  render() {
    const {disabled = false, children} = this.props;
    return (
      <div className="json-editor-trigger">
        { disabled ? 
        ( <div className="editor-trigger disabled">
          { children || <Icon type="edit" disabled />}
        </div> ) :
        ( <div className="editor-trigger" onClick={() => { this.handleClick(); }} >
          { children || <span><Icon type="edit" />JSON</span>}
          </div>
        )
      }
      </div>
    );
  }
}
