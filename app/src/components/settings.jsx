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

// Custom components
import { Password } from 'react-material-dashboard/src/views/Settings/components';

// Component styles
const styles = theme => ({
  root: {}
});

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
            <button onClick={this.showTerms}>Terms and Conditions</button> of this service.
          </div>
          <Button color="primary" variant="contained" onClick={this.savePlan}>
            Update Subscription
          </Button>
        </PortletFooter>
        </>
        :
        <div style={{textAlign: 'center', padding: '20px'}}>
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

    console.log('classes', classes, className);
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
  render() {
    const { classes } = this.props;
    return (
      <DashboardLayout title="Settings">
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item md={7} xs={12}>
              <Subscriptions />
            </Grid>
            <Grid item md={5} xs={12}>
              <Password />
              <Grid item md={12} xs={12} style={{marginTop: '20px'}}>
                <ApiKeys />
              </Grid>
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
