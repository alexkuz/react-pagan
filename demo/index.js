import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { i18n } from 'redux-pagan';

if (!global.Intl) {
  require('intl');
  require('intl/locale-data/jsonp/en.js');
  require('intl/locale-data/jsonp/ru.js');
  require('intl/locale-data/jsonp/fi.js');
}

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore);

const rootReducer = combineReducers({
  i18n
});

const store = createStoreWithMiddleware(rootReducer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
