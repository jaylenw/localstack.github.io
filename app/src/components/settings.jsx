import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom';
import { plansService } from '../services/plans';
import compose from 'recompose/compose';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Button,
  CircularProgress,
  Grid,
  Link,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'react-material-dashboard/src/layouts';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'react-material-dashboard/src/components';

// Component styles
const styles = theme => ({
  root: {}
});

class SubscriptionsList extends Component {

    state = {
      subscriptions: [],
      isLoading: true
    };

    componentDidMount() {
      plansService.loadSubscriptions().then(
        subscriptions => this.setState({subscriptions: subscriptions, isLoading: false})
      );
    }

    render() {
        const { classes, className } = this.props;
        const { subscriptions } = this.state;
        const rootClassName = classNames(classes.root, className);

        console.log('stats', this.props.stats);

        return (
          <Portlet className={rootClassName}>
            <PortletHeader>
              <PortletLabel title="Subscriptions"/>
            </PortletHeader>
            <PerfectScrollbar>
              <PortletContent className={classes.portletContent} noPadding>
                {this.state.isLoading && (
                  <div className={classes.progressWrapper + ' centeredPanel'}>
                    <CircularProgress />
                  </div>
                )}
                {this.state.subscriptions.length > 0 && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell align="left">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.subscriptions.map(order => (
                        <TableRow className={classes.tableRow} hover key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell className={classes.customerCell}>
                            {order.customer.name}
                          </TableCell>
                          <TableCell>
                            test
                          </TableCell>
                          <TableCell>
                            <div className={classes.statusWrapper}>
                              {order.status}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {!this.state.isLoading && !this.state.subscriptions.length &&
                  <div className='centeredPanel'>
                  No subscriptions enabled yet
                  </div>
                }
              </PortletContent>
            </PerfectScrollbar>
            <PortletFooter>
              <Button color="primary" variant="contained" onClick={this.props.newSubscription}>
                Add New Subscription
              </Button>
            </PortletFooter>
          </Portlet>
        );
    }
}

SubscriptionsList.propTypes = {
  classes: PropTypes.object.isRequired
};

SubscriptionsList = withStyles({})(SubscriptionsList);


class Subscriptions extends Component {
  state = {
    plans: []
  };

  constructor() {
    super();
    this.savePlan = this.savePlan.bind(this);
    this.showTerms = this.showTerms.bind(this);
  }

  componentDidMount() {
    this.setState({selectedPlan: 'p1'});
    plansService.loadPlans().then(
      plans => this.setState({plans: plans})
    );
    plansService.loadSubscriptions().then(
      subscriptions => this.setState({subscriptions: subscriptions})
    );
  }

  handleSelect(plan) {
    this.setState({selectedPlan: plan});
  }

  showTerms() {
    return this.props.history.push('/terms');
  }

  savePlan() {
    console.log('savePlan');
  }

  render() {
    const { classes, className, staticContext, ...rest } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet {...rest} className={rootClassName}>
        <form autoComplete="off" noValidate onSubmit={this.saveUser}>
        <PortletHeader>
          <PortletLabel subtitle="Please choose your plan below" title="Subscription"/>
        </PortletHeader>
        {this.state.plans.length ?
        <>
        <PortletContent noPadding>
          <PerfectScrollbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Features</TableCell>
                  <TableCell align="left">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.plans
                  .sort((p1, p2) => (p1.price > p2.price))
                  .map(plan =>
                  (<TableRow className={classes.tableRow} hover
                    key={plan.id} selected={this.state.selectedPlan === plan.id}>
                    <TableCell className={classes.tableCell}>
                      <div className={classes.tableCellInner}>
                        <Radio checked={this.state.selectedPlan === plan.id}
                          color="primary" onChange={event => this.handleSelect(plan.id)} value="true"/>
                        {plan.name}
                      </div>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {plan.description}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {plan.price} USD / month
                    </TableCell>
                  </TableRow>)
                )}
              </TableBody>
            </Table>
          </PerfectScrollbar>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <div style={{padding: '10px'}}>
            By clicking the button below, you agree to the
            &nbsp;<Link onClick={this.showTerms}>Terms and Conditions</Link> of this service.
          </div>
          <Button color="primary" variant="contained" onClick={this.savePlan}>
            Update Subscription
          </Button>
        </PortletFooter>
        </>
        :
        <div className='centeredPanel'>
          <CircularProgress/>
        </div>
        }
        </form>
      </Portlet>
    );
  }
}

Subscriptions.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

Subscriptions = compose(withRouter, withStyles(styles))(Subscriptions);


class ApiKeys extends Component {
  state = {
    apiKey: ''
  };

  fetchKey() {
    console.log('fetchKey')
  }

  render() {
    const { classes, className, ...rest } = this.props;
    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet {...rest} className={rootClassName}>
        <form autoComplete="off" noValidate onSubmit={this.saveUser}>
        <PortletHeader>
          <PortletLabel subtitle="Configure your environment" title="API Key"/>
        </PortletHeader>
        <PortletContent>
          <div>
          <code><pre>
            export LOCALSTACK_API_KEY={this.state.apiKey}
          </pre></code>
          </div>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button color="primary" variant="contained" onClick={this.fetchKey}>
            Fetch Key
          </Button>
        </PortletFooter>
        </form>
      </Portlet>
    );
  }
}

ApiKeys.propTypes = {
  classes: PropTypes.object.isRequired
};

ApiKeys = withStyles(styles)(ApiKeys);


export class Settings extends Component {
  state = {
    newSubscription: false
  }
  constructor() {
    super();
    this.newSubscription = this.newSubscription.bind(this);
  }
  newSubscription() {
    this.setState({newSubscription: true});
  }
  render() {
    const { classes } = this.props;
    return (
      <DashboardLayout title="Settings">
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item md={7} xs={12}>
              {this.state.newSubscription ?
              <Subscriptions /> :
              <SubscriptionsList newSubscription={this.newSubscription} />
              }
            </Grid>
            <Grid item md={5} xs={12}>
              <ApiKeys />
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired
};

Settings = withStyles(styles)(Settings);
