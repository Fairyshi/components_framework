import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import JsonView from 'react-json-view';
import {formatJsonData} from '../../util';
import { OPER_TYPE } from '../../constants';

export default class EditPanel extends PureComponent {
  static propTypes = {
    onChage: PropTypes.func,
    data: PropTypes.any,
  };

  constructor(props) {
    super(props);

    const { data, jsonEditorConfig } = props;

    this.state = { data, jsonEditorConfig };
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.state.data)) {
      this.setState({ data: nextProps.data });
    }
    if (JSON.stringify(nextProps.jsonEditorConfig) !== JSON.stringify(this.state.jsonEditorConfig)) {
      this.setState({ jsonEditorConfig: nextProps.jsonEditorConfig });
    }
  }

  changeJsonData = operType => event => {
    if (operType in OPER_TYPE) {
      const {updated_src: jsonData} = event;
      const formattedData = formatJsonData(jsonData);
      this.setState({ data: formattedData });
      this.props.onChange(formattedData);
    }
  };

  render() {
    const { data, jsonEditorConfig } = this.state;
    const {onAdd, onEdit, onDelete, ...others} = jsonEditorConfig;
    const props = {
      ...others,
      src: data,
      name: null,
      onAdd: onAdd ? event => this.changeJsonData(OPER_TYPE.ADD).call(this, event) : false,
      onEdit: onEdit ? event => this.changeJsonData(OPER_TYPE.EDIT).call(this, event) : false,
      onDelete: onDelete ? event => this.changeJsonData(OPER_TYPE.DELETE).call(this, event) : false,
    };
    const clx = classNames('json-editor-panel');
    return (
      <div className={clx}>
        <JsonView {...props} />
      </div>
    );
  }
}
