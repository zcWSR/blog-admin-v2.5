import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { createHashHistory } from 'history';

import 'common/styles/semantic.css';
import 'common/styles/common.less';
import 'common/styles/google-fonts.css';

import BaseStore from './base-store';
import AppRouter from './router';

const routingStore = new RouterStore();

const stores = {
  routing: routingStore,
  base: new BaseStore()
};

const hashHistory = createHashHistory();

const history = syncHistoryWithStore(hashHistory, routingStore);

ReactDOM.render(
  <div>
    <DevTools />
    <div>
      <Provider {...stores}>
        <AppRouter history={history} />
      </Provider>
    </div>
  </div>
  ,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
