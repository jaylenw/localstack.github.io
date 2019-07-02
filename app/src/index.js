import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// The following line needs to be imported before react-material-dashboard
import './initializers';

import * as serviceWorker from 'react-material-dashboard/src/common/serviceWorker';
import App from 'react-material-dashboard/src/App';

import { reducers } from './state/reducers';

const store = createStore(reducers);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
