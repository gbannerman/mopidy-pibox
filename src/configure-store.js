import rootReducer from './reducers/root';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

export default (initialState) => {

  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};