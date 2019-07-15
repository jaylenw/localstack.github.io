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
  Event as EventsIcon,
  LibraryAdd as ResourcesIcon,
  CheckCircleOutline as CheckIcon
} from '@material-ui/icons';

// Shared layouts
import { Dashboard as DashboardLayout } from 'react-material-dashboard/src/layouts';

// Shared components
import { Paper } from 'react-material-dashboard/src/components';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent
} from 'react-material-dashboard/src/components';

import { eventsService } from '../services/events';
import { plansService } from '../services/plans';
import { clone } from '../util';

const counterStyles = (color) => (theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  content: {
    display: 'flex',
    alignItems: 'center'
  },
  details: {},
  title: {
    color: theme.palette.text.secondary,
    fontWeight: 700
  },
  value: {
    marginTop: theme.spacing(1)
  },
  iconWrapper: {
    alignItems: 'center',
    backgroundColor: color,
    borderRadius: '50%',
    display: 'inline-flex',
    height: '4rem',
    justifyContent: 'center',
    marginLeft: 'auto',
    width: '4rem'
  },
  icon: {
    color: theme.palette.common.white,
    fontSize: '2rem',
    height: '2rem',
    width: '2rem'
  },
  footer: {
    marginTop: theme.spacing(3)
  }
});

const EVENT_TYPES_CREATION = [
  's3.cb', 'ddb.ct', 'kns.cs', 'lmb.cf', 'sqs.cq', 'sns.ct', 'stf.cm', 'agw.ca'
];
const SERVICE_CODES = {
  'inf': 'Infrastructure',
  's3': 'S3',
  'ddb': 'Dynamo DB',
  'kns': 'Kinesis',
  'lmb': 'Lambda',
  'sqs': 'SQS',
  'sns': 'SNS',
  'stf': 'Step Functions',
  'agw': 'API Gateway'
};
const ACTION_TYPES = {
  's3.cb': 'Create bucket',
  'inf.up': 'Start up',
  'inf.dn': 'Shut down',
  'ddb.ct': 'Create table',
  'ddb.dt': 'Delete table',
  'kns.cs': 'Create stream',
  'kns.ds': 'Delete stream',
  'lmb.cf': 'Create function',
  'lmb.df': 'Delete function',
  'sqs.cq': 'Create queue',
  'sqs.dq': 'Delete queue',
  'sns.ct': 'Create topic',
  'sns.dt': 'Delete topic',
  'stf.cm': 'Create state machine',
  'stf.dm': 'Delete state machine',
  'agw.ca': 'Create REST API',
  'agw.da': 'Delete REST API'
};

class EventsList extends Component {
    state = {
      isLoading: true
    };
    getResource = (eventType) => {
      const resource = eventType.split('.')[0];
      return SERVICE_CODES[resource] || `Generic (${eventType})`;
    }
    getAction = (eventType) => {
      return ACTION_TYPES[eventType];
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
      return SERVICE_CODES[resource] || `Generic (${eventType})`;
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
                    {Object.keys(eventCounts)
                      .sort((k1, k2) => (eventCounts[k2] - eventCounts[k1]))
                      .map(key => (
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

class BaseCounter extends Component {
  icon = EventsIcon;
  count = () => {
    return 0;
  }
  render() {
    const { classes, className, ...rest } = this.props;
    const { title } = this;
    const rootClassName = classNames(classes.root, className);
    return (
      <Paper {...rest} className={rootClassName}>
        <div className={classes.content}>
          <div className={classes.details}>
            <Typography className={classes.title} variant="body2">{title}</Typography>
            <Typography className={classes.value} variant="h3">{this.count()}</Typography>
          </div>
          <div className={classes.iconWrapper}>
            {React.createElement(this.icon, {className: classes.icon})}
          </div>
        </div>
      </Paper>
    );
  }
}

BaseCounter.propTypes = {
  classes: PropTypes.object.isRequired
};


class ResourcesCounter extends BaseCounter {
  title = 'RESOURCES CREATED';
  icon = ResourcesIcon;
  count = () => {
    const events = (this.props.stats || {}).events;
    if (!events || !events.counts.event_types) return 0;
    const result = Object.keys(events.counts.event_types).reduce((count, e) => {
      const value = EVENT_TYPES_CREATION.includes(e) ? events.counts.event_types[e] : 0;
      return value + count;
    }, 0);
    return result;
  }
}

ResourcesCounter = withStyles(counterStyles('green'))(ResourcesCounter);


class EventsCounter extends BaseCounter {
  title = 'TOTAL EVENTS';
  count = () => {
    return (((this.props.stats || {}).events || {}).counts || {}).total;
  }
}

EventsCounter = withStyles(counterStyles('#0767DB'))(EventsCounter);


class SuccessCounter extends BaseCounter {
  title = 'SUCCESSFUL API CALLS';
  icon = CheckIcon;
  count = () => {
    return '100 %';
  }
}

SuccessCounter = withStyles(counterStyles('orange'))(SuccessCounter);


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
      subs = subs.reduce((result, sub) => {
        JSON.parse(sub.metadata.api_keys).forEach(key => {
          const subCopy = clone(sub);
          subCopy.metadata.api_key = key;
          result.push(subCopy);
        });
        return result;
      }, []);

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
      if (name === 'apiKey' && value) {
        const selected = this.state.subscriptions.filter(sub => sub.metadata.api_key === value)[0];
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
              <Select className={classes.textField} onChange={this.handleChange('apiKey')}
                label="API Key" value={(selectedSubscription.metadata || {}).api_key || ''}
                variant="outlined" style={{marginLeft: '20px'}}>
                {this.state.subscriptions.map(sub =>
                  <MenuItem key={sub.metadata.api_key} value={sub.metadata.api_key}>
                    {`API Key ${sub.metadata.api_key} (${sub.plan.name})`}
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
                <SuccessCounter className={classes.item} stats={(this.state || {}).stats} />
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
