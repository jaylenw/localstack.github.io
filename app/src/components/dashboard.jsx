import React, { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

// Externals
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

// Material components
import {
  Grid,
  Link,
  CircularProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  Tooltip,
  TableSortLabel,
  Typography } from '@material-ui/core';

// Material icons
import {
  ArrowDownward as ArrowDownwardIcon
} from '@material-ui/icons';

// Shared layouts
import { Dashboard as DashboardLayout } from 'react-material-dashboard/src/layouts';

import counterStyles from 'react-material-dashboard/src/views/Dashboard/components/Budget/styles';

// Shared components
import { Paper } from 'react-material-dashboard/src/components';

// Custom components
import {
  Users,
  Progress
} from 'react-material-dashboard/src/views/Dashboard/components';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  Status
} from 'react-material-dashboard/src/components';

import { eventsService } from '../services/events';
import { plansService } from '../services/plans';

class ResourcesList extends Component {

    state = {
      isLoading: true,
      limit: 10,
      orders: [],
      ordersTotal: 0
    };

    render() {
        const { classes, className } = this.props;
        const { isLoading, orders, ordersTotal } = this.state;

        const rootClassName = classNames(classes.root, className);
        const showOrders = !isLoading && orders.length > 0;

        return (
          <Portlet className={rootClassName}>
            <PortletHeader noDivider>
              <PortletLabel subtitle={`${ordersTotal} in total`} title="Latest Events"/>
            </PortletHeader>
            <PerfectScrollbar>
              <PortletContent className={classes.portletContent} noPadding>
                {isLoading && (
                  <div className={classes.progressWrapper}>
                    <CircularProgress />
                  </div>
                )}
                {showOrders && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell align="left">Customer</TableCell>
                        <TableCell align="left" sortDirection="desc">
                          <Tooltip enterDelay={300} title="Sort">
                            <TableSortLabel active direction="desc">
                              Date
                            </TableSortLabel>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map(order => (
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
                              <Status className={classes.status} size="sm"/>
                              {order.status}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </PortletContent>
            </PerfectScrollbar>
          </Portlet>
        );
    }
}

ResourcesList.propTypes = {
  classes: PropTypes.object.isRequired
};

ResourcesList = withStyles({})(ResourcesList);

class ResourcesCounter extends Component {
  render() {
    const { classes, className, ...rest } = this.props;
    const rootClassName = classNames(classes.root, className);

    return (
      <Paper {...rest} className={rootClassName}>
        <div className={classes.content}>
          <div className={classes.details}>
            <Typography className={classes.title} variant="body2">
              RESOURCES
            </Typography>
            <Typography className={classes.value} variant="h3">
              {((this.props.stats || {}).events || {}).count}
            </Typography>
          </div>
          <div className={classes.iconWrapper}>
            $
          </div>
        </div>
        <div className={classes.footer}>
          <Typography className={classes.difference} variant="body2">
            <ArrowDownwardIcon />
            12%
          </Typography>
          <Typography className={classes.caption} variant="caption">
            Since last month
          </Typography>
        </div>
      </Paper>
    );
  }
}

ResourcesCounter.propTypes = {
  classes: PropTypes.object.isRequired
};

ResourcesCounter = withStyles(counterStyles)(ResourcesCounter);


export class Dashboard extends Component {
  state = {
    apiKey: '',
    subscriptions: null,
    selectedSubscription: null
  };

  constructor() {
    super()
    this.addSubscription = this.addSubscription.bind(this);
  }

  componentDidMount() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    plansService.loadSubscriptions().then(subs => {
      console.log(subs)
      this.setState({subscriptions: subs});
      this.loadStats();
    });
  }

  loadStats() {
    eventsService.getStats(this.state.apiKey).then(stats => {
      this.setState({stats});
    });
  }

  handleChange(name) {
    return event => {
      this.setState({ ...this.state, [name]: event.target.value });
      this.loadStats()
    }
  }

  hasSubscriptions() {
    return this.state.subscriptions && this.state.subscriptions.length > 0;
  }

  addSubscription() {
    return this.props.history.push('/settings');
  }

  render() {
    const { classes } = this.props;
    const { apiKey } = this.state;

    return (
      <DashboardLayout title="Dashboard">
        <div className={classes.root}> {
        this.state.subscriptions === null ?
          <Paper style={{textAlign: 'center', padding: '20px'}}>
            <CircularProgress />
          </Paper>
        : !this.hasSubscriptions() ?
          <Paper style={{textAlign: 'center', padding: '20px'}}>
            Please <Link onClick={this.addSubscription}>add a subscription</Link>
            &nbsp;to your account to enable the dashboard view.
          </Paper>
        :
          <div>
            Choose Subscription:
            <Select className={classes.textField} onChange={this.handleChange('apiKey')}
              label="API Key" margin="dense" required value={apiKey} variant="outlined">
              {this.state.subscriptions.map(sub =>
                <MenuItem key={sub.id} value={sub.metadata.license_key}>
                  {`${sub.plan.name} (key ${sub.metadata.license_key})`}
                </MenuItem>)}
            </Select>
            <Grid container spacing={4}>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <ResourcesCounter className={classes.item} stats={(this.state || {}).stats} />
              </Grid>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <Users className={classes.item} />
              </Grid>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <Progress className={classes.item} />
              </Grid>
              <Grid item lg={4} md={6} xl={3} xs={12}>
                <ResourcesList className={classes.item} stats={(this.state || {}).stats} />
              </Grid>
            </Grid>
          </div>
        }
        </div>
      </DashboardLayout>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

Dashboard = withRouter(Dashboard);
