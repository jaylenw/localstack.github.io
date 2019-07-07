import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material components
import { Divider, Link, Typography } from '@material-ui/core';

export class Footer extends Component {

  constructor() {
    super();
    this.showTerms = this.showTerms.bind(this);
  }

  showTerms() {
    this.props.history.push('/terms')
  }

  render() {
    const { classes, className } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        <Divider />
        <Typography
          className={classes.company}
          variant="body1"
        >
          &copy; LocalStack 2017-2019
        </Typography>
        <Typography variant="caption">
          All rights reserved. <Link onClick={this.showTerms}>Terms of Service</Link>
        </Typography>
      </div>
    );
  }
}

Footer.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

Footer = withRouter(Footer);
