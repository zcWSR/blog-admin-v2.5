import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { browserHistory } from 'react-router';

import 'common/styles/semantic.css';
import 'common/styles/common.less';
import 'common/styles/google-fonts.css';

import BaseStore from './base-store';
import Frame from './frame';
import AppRouter from './router';

const routingStore = new RouterStore();

const stores = {
  routing: routingStore,
  base: new BaseStore()
};

const history = syncHistoryWithStore(browserHistory, routingStore);

ReactDOM.render(
  <Provider {...stores}>
    <Frame>
      <AppRouter history={history} />
    </Frame>
  </Provider>,
  document.getElementById('app')
);
