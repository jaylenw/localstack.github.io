import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';

// Shared components
import {
  Portlet,
  PortletContent
} from 'react-material-dashboard/src/components';

// Material components
import {
  withStyles
} from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'react-material-dashboard/src/layouts';

/* eslint import/no-webpack-loader-syntax: 0 */
import markdown from '!!raw-loader!./documentation.md';

// Component styles
const styles = theme => ({
  root: {
      margin: theme.spacing(4),
  },
  textField: {
    width: '100%'
  },
  portletFooter: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
});


class DocumentationView extends Component {
  state = { tabIndex: 0 };

  render() {
    const { classes, className, staticContext, ...rest } = this.props;
    const rootClassName = classNames(classes.root, className);
    return (
      <DashboardLayout title="Documentation">
        <div style={{fontSize: '1px'}}>&nbsp;</div>
        <Portlet {...rest} className={rootClassName}>
          <PortletContent className={'markdown-body'}>
            <ReactMarkdown source={markdown} className={'markdown-body'}/>
          </PortletContent>
        </Portlet>
      </DashboardLayout>
    );
  }
}

DocumentationView.propTypes = {
  classes: PropTypes.object.isRequired
};

const Documentation = withStyles(styles)(DocumentationView);
export default Documentation;
