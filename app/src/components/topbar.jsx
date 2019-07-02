import React, { Component, Fragment } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material components
import {
  IconButton,
  Toolbar,
  Typography
} from '@material-ui/core';

// Material icons
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Input as InputIcon
} from '@material-ui/icons';

export class Topbar extends Component {

    handleSignOut = () => {
        localStorage.setItem('userInfo', '');
        this.props.history.push('/sign-in');
    };

    componentDidMount() {
        if(!localStorage.getItem('userInfo')) {
            return this.props.history.push('/sign-in');
        }
    }

    render() {
        const {
            classes,
            className,
            title,
            isSidebarOpen,
            onToggleSidebar
        } = this.props;

        const rootClassName = classNames(classes.root, className);

        return (
          <Fragment>
            <div className={rootClassName}>
              <Toolbar className={classes.toolbar}>
                <IconButton
                  className={classes.menuButton}
                  onClick={onToggleSidebar}
                  variant="text"
                >
                  {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
                <Typography
                  className={classes.title}
                  variant="h4"
                >
                  {title}
                </Typography>
                <IconButton
                  className={classes.signOutButton}
                  onClick={this.handleSignOut}
                >
                  <InputIcon />
                </IconButton>
              </Toolbar>
            </div>
          </Fragment>
        );
    }
}

Topbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isSidebarOpen: PropTypes.bool,
  onToggleSidebar: PropTypes.func,
  title: PropTypes.string
};

Topbar.defaultProps = {
  onToggleSidebar: () => {}
};

Topbar.styles = {
  signOutButton: {
    marginLeft: 'auto'
  }
}
