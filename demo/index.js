import React from 'react';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { i18n } from 'redux-pagan';

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore);

const rootReducer = combineReducers({
  i18n
});

const store = createStoreWithMiddleware(rootReducer);

React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  document.getElementById('root')
);
