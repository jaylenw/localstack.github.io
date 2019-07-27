import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

// Material components
import { withStyles } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'react-material-dashboard/src/layouts';

// Shared components
import { Paper } from 'react-material-dashboard/src/components';

/* eslint import/no-webpack-loader-syntax: 0 */
import markdown from '!!raw-loader!../assets/terms.md';

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
              <Paper style={{padding: '30px'}}>
                <ReactMarkdown source={markdown} className={'markdown-body'}/>
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
