import React, { Component } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';
import classNames from 'classnames';

// Externals
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

// Material components
import {
  Grid,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'react-material-dashboard/src/layouts';

// Custom components
import {
  Budget,
  Users,
  Progress
} from 'react-material-dashboard/src/views/Dashboard/components';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletToolbar,
  PortletContent,
  Status
} from 'react-material-dashboard/src/components';

import { eventsService } from '../services/events';

class ResourcesList extends Component {

    state = {
      isLoading: false,
      limit: 10,
      orders: [],
      ordersTotal: 0
    };

    componentDidMount() {
      // TODO
    }

    render() {
      const { classes, className } = this.props;
      const { isLoading, orders, ordersTotal } = this.state;

      const rootClassName = classNames(classes.root, className);
      const showOrders = !isLoading && orders.length > 0;

      return (
        <Portlet className={rootClassName}>
          <PortletHeader noDivider>
            <PortletLabel
              subtitle={`${ordersTotal} in total`}
              title="Latest orders"
            />
            <PortletToolbar>
              <Button
                className={classes.newEntryButton}
                color="primary"
                size="small"
                variant="outlined"
              >
                New entry
              </Button>
            </PortletToolbar>
          </PortletHeader>
          <PerfectScrollbar>
            <PortletContent
              className={classes.portletContent}
              noPadding
            >
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
                      <TableCell
                        align="left"
                        sortDirection="desc"
                      >
                        <Tooltip
                          enterDelay={300}
                          title="Sort"
                        >
                          <TableSortLabel
                            active
                            direction="desc"
                          >
                            Date
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map(order => (
                      <TableRow
                        className={classes.tableRow}
                        hover
                        key={order.id}
                      >
                        <TableCell>{order.id}</TableCell>
                        <TableCell className={classes.customerCell}>
                          {order.customer.name}
                        </TableCell>
                        <TableCell>
                          test
                        </TableCell>
                        <TableCell>
                          <div className={classes.statusWrapper}>
                            <Status
                              className={classes.status}
                              size="sm"
                            />
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


export class Dashboard extends Component {
  componentDidMount() {
    eventsService.getStats();
  }

  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Dashboard">
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget className={classes.item} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Users className={classes.item} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Progress className={classes.item} />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <ResourcesList className={classes.item} />
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};
