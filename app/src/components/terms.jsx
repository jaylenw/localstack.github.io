import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material components
import { withStyles } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'react-material-dashboard/src/layouts';

// Shared components
import { Paper } from 'react-material-dashboard/src/components';

import terms from '../assets/terms';

const styles = theme => ({
  root: {
    padding: theme.spacing(3)
  }
});


export default class TermsOfService extends Component {

    render() {
        const { classes } = this.props;
        return (
          <DashboardLayout title="Terms">
            <div className={classes.root}>
              <Paper style={{textAlign: 'center', padding: '20px'}}>
                {terms}
              </Paper>
            </div>
          </DashboardLayout>
        );
    }
}

TermsOfService.propTypes = {
  classes: PropTypes.object.isRequired
};

TermsOfService = withStyles(styles)(TermsOfService);
