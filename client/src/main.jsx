import React from 'react';
import {Provider} from 'react-redux';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import store from './store.js';

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
