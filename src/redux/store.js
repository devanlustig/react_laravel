import { createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  dodol: 1,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    case 'INCREMENT':
      return { dodol : state.dodol + 1 };
    case 'DECREMENT':
      return { dodol : state.dodol - 1 };
    default:
      return state
  }
}

const store = createStore(changeState)
export default store

{ /* import { createStore } from 'redux';
import rootReducer from './reducers';


const store = createStore(rootReducer);
export default store; */ }

