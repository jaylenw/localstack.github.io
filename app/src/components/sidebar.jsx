import React from 'react';
import classNames from 'classnames';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// Material components
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core';

import {
  DashboardOutlined as DashboardIcon,
  AccountBoxOutlined as AccountBoxIcon,
  SettingsOutlined as SettingsIcon
} from '@material-ui/icons';

import { usersService } from '../services/users';

export class Sidebar extends React.Component {

    render = () => {
        const { classes, className } = this.props;
        const rootClassName = classNames(classes.root, className);
        return (
          <nav className={rootClassName}>
            <div className={classes.logoWrapper}>
              <Link
                className={classes.logoLink}
                to="/"
              >
                <img
                  alt="LocalStack"
                  className={classes.logoImage}
                  src="/images/logos/localstack.png"
                /> LocalStack
              </Link>
            </div>
            <Divider className={classes.logoDivider} />
            <div className={classes.profile}>
              <Typography
                className={classes.nameText}
                variant="h6"
              >
                {usersService.getUserName()}
              </Typography>
            </div>
            <Divider className={classes.profileDivider} />
            <List
              component="div"
              disablePadding
            >
              <ListItem
                activeClassName={classes.activeListItem}
                className={classes.listItem}
                component={NavLink}
                to="/dashboard"
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Dashboard"
                />
              </ListItem>
              <ListItem
                activeClassName={classes.activeListItem}
                className={classes.listItem}
                component={NavLink}
                to="/account"
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Account"
                />
              </ListItem>
              <ListItem
                activeClassName={classes.activeListItem}
                className={classes.listItem}
                component={NavLink}
                to="/settings"
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Settings"
                />
              </ListItem>
            </List>
          </nav>
        );
    };
}

Sidebar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

Sidebar.styles = {
  logoImage: {
    'width': '100px'
  }
};
