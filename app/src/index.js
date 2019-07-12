import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// The following line needs to be imported before react-material-dashboard
import './initializers';

import * as serviceWorker from 'react-material-dashboard/src/common/serviceWorker';

import { reducers } from './state/reducers';
import NewApp from './components/app';

import './assets/index.scss';

const store = createStore(reducers);

ReactDOM.render(
    <Provider store={store}>
      <NewApp/>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
