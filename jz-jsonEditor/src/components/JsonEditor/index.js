var FbEventEmitter = require('fbemitter');

import Toolbar from './Toolbar';
import EditPanel from './EditPanel';
import ComponentView from './ComponentView';
import PageView from './PageView';
import Controller from './Controller';
import { EDITOR_PANEL_STATUS } from '../../constants.js';

const emitter = new FbEventEmitter.EventEmitter();

Controller.EditTigger = ComponentView.EditTigger;
export default Controller;

export { emitter, PageView, ComponentView, EditPanel, Toolbar, EDITOR_PANEL_STATUS as STATUS };
