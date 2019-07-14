import React, { Component } from 'react';
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
import { Progress } from 'react-material-dashboard/src/views/Dashboard/components';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent
} from 'react-material-dashboard/src/components';

import { eventsService } from '../services/events';
import { plansService } from '../services/plans';

const EVENT_TYPES_CREATION = ['s3.cb', 'ddb.ct', 'kns.cs'];


class EventsList extends Component {

    state = {
      isLoading: true
    };

    getResource = (eventType) => {
      const resource = eventType.split('.')[0];
      const resources = {
        's3': 'S3',
        'ddb': 'DynamoDB',
        'kns': 'Kinesis',
        'inf': 'Infrastructure'
      }
      return resources[resource] || `Generic (${eventType})`;
    }
    getAction = (eventType) => {
      const actions = {
        's3.cb': 'Create bucket',
        'inf.up': 'Start up',
        'inf.dn': 'Shut down',
        'ddb.ct': 'Create table',
        'kns.cs': 'Create stream'
      }
      return actions[eventType];
    }

    render() {
        const { classes, className } = this.props;
        const statsEvents = (this.props.stats || {}).events;
        const isLoading = typeof statsEvents === 'undefined';
        const events = (statsEvents && statsEvents.latest) || [];

        const rootClassName = classNames(classes.root, className);
        const showEvents = !isLoading && events.length > 0;

        return (
          <Portlet className={rootClassName}>
            <PortletHeader>
              <PortletLabel title="Latest Events"/>
            </PortletHeader>
            <PortletContent className={classes.portletContent} noPadding>
              {isLoading && (
                <div className={classes.progressWrapper + ' centeredPanel'}>
                  <CircularProgress />
                </div>
              )}
              {showEvents && (
                <Table className='compactTable'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Server Time</TableCell>
                      <TableCell>Resource</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Machine ID</TableCell>
                      <TableCell>Process ID</TableCell>
                      <TableCell>Payload</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map(item => (
                      <TableRow className={classes.tableRow} hover key={item.e_t + item.s_t + item.p}>
                        <TableCell>{item.s_t}</TableCell>
                        <TableCell>{this.getResource(item.e_t)}</TableCell>
                        <TableCell>{this.getAction(item.e_t)}</TableCell>
                        <TableCell>{item.m_id}</TableCell>
                        <TableCell>{item.p_id}</TableCell>
                        <TableCell>{item.p}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {!isLoading && !showEvents &&
                <div className={'centeredPanel'}>No events recorded yet.</div>
              }
            </PortletContent>
          </Portlet>
        );
    }
}

EventsList.propTypes = {
  classes: PropTypes.object.isRequired
};

EventsList = withStyles({})(EventsList);

class ResourcesStats extends Component {

    state = {
      isLoading: true
    };

    getResource = (eventType) => {
      const resource = eventType.split('.')[0];
      const resources = {
        's3': 'S3',
        'ddb': 'DynamoDB',
        'kns': 'Kinesis',
        'inf': 'Infrastructure'
      }
      return resources[resource] || `Generic (${eventType})`;
    }

    render() {
        const { classes } = this.props;
        const statsEvents = (this.props.stats || {}).events;
        const isLoading = typeof statsEvents === 'undefined';
        const allEventCounts = ((statsEvents && statsEvents.counts) || {}).event_types || {};
        const eventCounts = Object.keys(allEventCounts)
          .filter( key => EVENT_TYPES_CREATION.includes(key) )
          .reduce( (res, key) => {res[key] = allEventCounts[key]; return res}, {} );
        const showCounts = !isLoading && Object.keys(eventCounts).length > 0;

        return (
          <Portlet>
            <PortletHeader>
              <PortletLabel title="Resource Stats"/>
            </PortletHeader>
            <PortletContent noPadding>
              {isLoading && (
                <div className={classes.progressWrapper + ' centeredPanel'}>
                  <CircularProgress />
                </div>
              )}
              {showCounts && (
                <Table className='compactTable'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Resource</TableCell>
                      <TableCell>Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(eventCounts).map(key => (
                      <TableRow className={classes.tableRow} hover key={key}>
                        <TableCell>{this.getResource(key)}</TableCell>
                        <TableCell>{eventCounts[key]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {!isLoading && !showCounts &&
                <div className={'centeredPanel'}>No events recorded yet.</div>
              }
            </PortletContent>
          </Portlet>
        );
    }
}

ResourcesStats.propTypes = {
  classes: PropTypes.object.isRequired
};

ResourcesStats = withStyles({})(ResourcesStats);

class ResourcesCounter extends Component {

  count = () => {
    const events = (this.props.stats || {}).events;
    if (!events || !events.counts.event_types) return 0;
    const result = Object.keys(events.counts.event_types).reduce((count, e) => {
      const value = EVENT_TYPES_CREATION.includes(e) ? events.counts.event_types[e] : 0;
      return value + count;
    }, 0);
    return result;
  }

  render() {
    const { classes, className, ...rest } = this.props;
    const rootClassName = classNames(classes.root, className);

    return (
      <Paper {...rest} className={rootClassName}>
        <div className={classes.content}>
          <div className={classes.details}>
            <Typography className={classes.title} variant="body2">
              RESOURCES CREATED
            </Typography>
            <Typography className={classes.value} variant="h3">
              {this.count()}
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


class EventsCounter extends Component {
  render() {
    const { classes, className, ...rest } = this.props;
    const rootClassName = classNames(classes.root, className);

    return (
      <Paper {...rest} className={rootClassName}>
        <div className={classes.content}>
          <div className={classes.details}>
            <Typography className={classes.title} variant="body2">
              TOTAL EVENTS
            </Typography>
            <Typography className={classes.value} variant="h3">
              {(((this.props.stats || {}).events || {}).counts || {}).total}
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

EventsCounter.propTypes = {
  classes: PropTypes.object.isRequired
};

EventsCounter = withStyles(counterStyles)(EventsCounter);


export class Dashboard extends Component {
  state = {
    apiKey: '',
    subscriptions: null,
    selectedSubscription: null
  };

  componentDidMount() {
    this.loadSubscriptions();
  }

  loadSubscriptions = () => {
    plansService.loadSubscriptions().then(subs => {
      subs = subs.filter(sub => sub.plan.amount > 0);
      this.setState({subscriptions: subs});
      if (subs.length > 0) {
        this.setState({selectedSubscription: subs[0]});
      }
      this.loadStats();
    });
  }

  loadStats = (subscription) => {
    subscription = subscription || this.state.selectedSubscription;
    eventsService.getStats(subscription.metadata.api_key).then(stats => {
      this.setState({stats});
    });
  }

  handleChange = (name) => {
    return event => {
      const value = event.target.value;
      if (name === 'subscriptionId' && value) {
        const selected = this.state.subscriptions.filter(sub => sub.id === value)[0];
        this.setState({ selectedSubscription: selected });
        this.loadStats(selected);
      } else {
        this.setState({ ...this.state, [name]: value });
      }
    };
  }

  hasSubscriptions = () => {
    return this.state.subscriptions && this.state.subscriptions.length > 0;
  }

  addSubscription = () => {
    return this.props.history.push('/settings');
  }

  render() {
    const { classes } = this.props;
    let { selectedSubscription } = this.state;
    selectedSubscription = selectedSubscription || {};

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
            <div style={{marginBottom: '20px'}}>
              Choose Subscription:
              <Select className={classes.textField} onChange={this.handleChange('subscriptionId')}
                label="API Key" value={selectedSubscription.id || ''} variant="outlined" style={{marginLeft: '20px'}}>
                {this.state.subscriptions.map(sub =>
                  <MenuItem key={sub.id} value={sub.id}>
                    {`${sub.plan.name} (key ${sub.metadata.api_key})`}
                  </MenuItem>)}
              </Select>
            </div>
            <Grid container spacing={4}>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <ResourcesCounter className={classes.item} stats={(this.state || {}).stats} />
              </Grid>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <EventsCounter className={classes.item} stats={(this.state || {}).stats} />
              </Grid>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <Progress className={classes.item} />
              </Grid>
              <Grid item lg={8} md={12} xl={8} xs={12}>
                <EventsList className={classes.item} stats={(this.state || {}).stats} />
              </Grid>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <ResourcesStats className={classes.item} stats={(this.state || {}).stats} />
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
