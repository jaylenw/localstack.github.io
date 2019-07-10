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
  Checkbox,
  Grid,
  Link,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField } from '@material-ui/core';

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
                {subscriptions.length > 0 && (
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
                      {subscriptions.map(order => (
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
                {!this.state.isLoading && !subscriptions.length &&
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


class SubscriptionCreate extends Component {
  state = {
    plans: [],
    quantity: 1,
    accepted: false
  };
  maxQuantity = 20;

  componentDidMount() {
    this.setState({selectedPlan: null});
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

  showTerms = () => {
    return this.props.history.push('/terms');
  };

  createSubscription = () => {
    this.setState({errorMessage: ''});
    plansService.createSubscription(this.state.selectedPlan, this.state.quantity).then(
      subs => this.props.history.push('/')
    ).catch((error) => {
      this.setState({errorMessage: 'An error occurred and your request could not be processed. ' +
        'Please check if your payment details are up to date in the account settings.'});
    });
  };

  updateQuantity = event => {
    let quantity = event.target.value;
    if (isNaN(quantity)) {
      return;
    }
    if (quantity === '') {
      quantity = 0;
    }
    quantity = parseInt(quantity);
    if (quantity >= 0 && quantity <= 20) {
      this.setState({ quantity });
    }
  };

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
                  key={plan.id} selected={(this.state.selectedPlan || {}).id === plan.id}>
                  <TableCell className={classes.tableCell}>
                    <div className={classes.tableCellInner}>
                      <Radio checked={(this.state.selectedPlan || {}).id === plan.id}
                        color="primary" onChange={event => this.handleSelect(plan)} value="true"/>
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
        </PortletContent>
        {!!this.state.selectedPlan &&
          <>
            <PortletContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Selected Plan:</TableCell>
                    <TableCell>{this.state.selectedPlan.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Select Quantity (1-{this.maxQuantity}):</TableCell>
                    <TableCell>
                      <TextField className={classes.textField} variant="outlined" onChange={this.updateQuantity}
                      label="Quantity" margin="dense" required value={this.state.quantity}/>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Monthly Costs:</TableCell>
                    <TableCell>{this.state.selectedPlan.price * this.state.quantity} USD</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </PortletContent>
            <PortletFooter className={classes.portletFooter}>
              <div style={{padding: '10px'}}>
                <Checkbox checked={this.state.accepted}
                  onChange={e => this.setState({accepted: !this.state.accepted})}/>
                I agree to the
                &nbsp;<Link onClick={this.showTerms}>Terms and Conditions</Link> of this service.
              </div>
              <Button color="primary" variant="contained" onClick={this.createSubscription}
                  disabled={!this.state.quantity || !this.state.accepted}>
                Create Subscription
              </Button>
              <div style={{padding: '8px', color: 'red'}}>{this.state.errorMessage}</div>
            </PortletFooter>
          </>
        }
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

SubscriptionCreate.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

SubscriptionCreate = compose(withRouter, withStyles(styles))(SubscriptionCreate);


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
            {this.state.newSubscription ?
            <Grid item md={9} xs={12}>
              <SubscriptionCreate />
            </Grid> :
            <>
            <Grid item md={7} xs={12}>
              <SubscriptionsList newSubscription={this.newSubscription} />
            </Grid>
            <Grid item md={5} xs={12}>
              <ApiKeys />
            </Grid>
            </>
            }
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
