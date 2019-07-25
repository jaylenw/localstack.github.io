import React, { Component } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// Material helpers
import { ThemeProvider } from '@material-ui/styles';

import Dashboard from 'react-material-dashboard/src/views/Dashboard';
import Account from 'react-material-dashboard/src/views/Account';
import Settings from 'react-material-dashboard/src/views/Settings';
import SignUp from 'react-material-dashboard/src/views/SignUp';
import SignIn from 'react-material-dashboard/src/views/SignIn';
import NotFound from 'react-material-dashboard/src/views/NotFound';
import Documentation from './documentation';
import TermsOfService from './terms';

// App
import App from 'react-material-dashboard/src/App';

// Theme
import theme from 'react-material-dashboard/src/theme';

const browserHistory = createBrowserHistory();


class Routes extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/" to="/dashboard"/>
        <Route component={Dashboard} exact path="/dashboard"/>
        <Route component={Account} exact path="/account"/>
        <Route component={Settings} exact path="/settings"/>
        <Route component={TermsOfService} exact path="/terms"/>
        <Route component={Documentation} exact path="/docs"/>
        <Route component={SignUp} exact path="/sign-up"/>
        <Route component={SignIn} exact path="/sign-in"/>
        <Route component={NotFound} exact path="/not-found"/>
        <Redirect to="/not-found" />
      </Switch>
    );
  }
}

export default class NewApp extends App {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </ThemeProvider>
    );
  }
}
