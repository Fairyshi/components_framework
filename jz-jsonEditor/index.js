import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import React, {PureComponent} from 'react';
import _ from 'lodash';
import './index.css';
import JsonEditor from './src/components/JsonEditor';
import {MODE, EDITOR_PANEL_STATUS} from './src/constants';

const { EditTigger } = JsonEditor;

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: 'close',
    };
  }

  toggle = () => {
    this.setState({
      status: this.state.status === EDITOR_PANEL_STATUS.close ? EDITOR_PANEL_STATUS.open : EDITOR_PANEL_STATUS.close,
    });
  };

  render() {
    const {status} = this.state;

    return (
      <div style={{margin: 100}}>
        <h1>Json-editor Demo</h1>
        <hr />
        <br />
        Default Editor Trigger: <EditTigger data={{aa: 'aa', bb: 'bb'}} currentKey='key1' />
        <br />
        Customized Editor Trigger: <EditTigger data={{aa2: 'aa2', bb2: 'bb2'}} currentKey='key2' >
          <span>EDIT JSON</span>
        </EditTigger>
        <JsonEditor
          mode={MODE.COMPONENT}
          status={status}
          onToggle={this.toggle}
          header={<p key="jsonEditorHeader">名称: Hello world</p>}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
