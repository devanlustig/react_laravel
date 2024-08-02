import { combineReducers } from 'redux';
import counter from './counter';
import sidebarShow from './sidebar';

export default combineReducers({ counter, sidebarShow });