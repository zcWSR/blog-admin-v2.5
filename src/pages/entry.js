import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { createHashHistory } from 'history';

import 'common/utils/axios-config.js';
import 'common/styles/semantic.css';
import 'common/styles/common.less';
import 'common/styles/google-fonts.css';

import AppRouter from './router';
import getStores from './stores';

const routingStore = new RouterStore();

const stores = getStores(routingStore);

const hashHistory = createHashHistory();

const history = syncHistoryWithStore(hashHistory, routingStore);

ReactDOM.render(
  <Provider {...stores}>
    <AppRouter history={history} />
  </Provider>
  ,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
