import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { usersService } from '../services/users';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'react-material-dashboard/src/components';

import { default as detailsStyles } from 'react-material-dashboard/src/views/Account/components/AccountDetails/styles';

// Material helpers
import { withStyles } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'react-material-dashboard/src/layouts';

// Material components
import { Button, TextField, Grid } from '@material-ui/core';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  }
});

export class AccountDetails extends Component {

  state = {
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    country: '',
    phone: ''
  };

  handleChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.value });
  };

  componentDidMount = async () => {
    const result = await usersService.getUserDetails();
    const metadata = result.metadata || {};
    this.state = {
      firstname: metadata.firstname || '',
      lastname: metadata.lastname || '',
      email: metadata.email || '',
      country: metadata.country || '',
      address: metadata.address || '',
      phone: metadata.phone || ''
    };
    this.setState(this.state);
  }

  saveUser = async () => {
    this.setState({message: ''});
    await usersService.saveUserDetails(this.state);
    this.props.dispatch({type: 'USER_UPDATE', payload: this.state});
    this.setState({message: 'Details successfully updated'});
  }

  render() {
    const { classes, className, dispatch, ...rest } = this.props;
    const { firstname, lastname, phone, address, country, email } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet {...rest} className={rootClassName}>
        <form autoComplete="off" noValidate onSubmit={this.saveUser}>
        <PortletHeader>
          <PortletLabel subtitle="Update your personal details below" title="Profile"/>
        </PortletHeader>
        <PortletContent noPadding>
          <div className={classes.field}>
            <TextField className={classes.textField} onChange={this.handleChange('firstname')}
              label="First name" margin="dense" required value={firstname} variant="outlined"/>
            <TextField className={classes.textField} onChange={this.handleChange('lastname')}
              label="Last name" margin="dense" required value={lastname} variant="outlined"/>
          </div>
          <div className={classes.field}>
            <TextField className={classes.textField} onChange={this.handleChange('email')}
              label="Email Address" margin="dense" required value={email} variant="outlined"/>
            <TextField className={classes.textField} label="Phone Number" margin="dense"
              onChange={this.handleChange('phone')} value={phone} variant="outlined"/>
          </div>
          <div className={classes.field}>
            <TextField className={classes.textField} label="Address" margin="dense"
              onChange={this.handleChange('address')} required value={address} variant="outlined"/>
            <TextField className={classes.textField} label="Country" margin="dense"
              onChange={this.handleChange('country')} required value={country} variant="outlined"/>
          </div>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button color="primary" variant="contained" onClick={this.saveUser}>
            Save details
          </Button>
          <PortletLabel subtitle={this.state.message} style={{marginTop: '10px'}}/>
        </PortletFooter>
        </form>
      </Portlet>
    );
  }
}

AccountDetails.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
AccountDetails = connect(mapDispatchToProps)(AccountDetails);
AccountDetails = withStyles(detailsStyles)(AccountDetails);


export class AccountBilling extends Component {
    state = {}

    handleChange = name => event => {
      this.setState({ ...this.state, [name]: event.target.value });
    };

    render() {
      const { classes, className, ...rest } = this.props;
      const { cardNumber, expiryMonth, expiryYear, ccv } = this.state;
      const rootClassName = classNames(classes.root, className);

      return (
        <Portlet {...rest} className={rootClassName}>
          <form autoComplete="off" noValidate onSubmit={this.saveUser}>
          <PortletHeader>
            <PortletLabel subtitle="Please provide your billing details" title="Billing"/>
          </PortletHeader>
          <PortletContent noPadding>
            <div className={classes.field}>
              <TextField className={classes.textField} onChange={this.handleChange('cardNumber')}
                label="Card Number" margin="dense" required value={cardNumber} variant="outlined"/>
              <TextField className={classes.textField} label="Month" margin="dense" style={{width: '100px'}}
                onChange={this.handleChange('expiryMonth')} required value={expiryMonth} variant="outlined"/>
              <TextField className={classes.textField} label="Year" margin="dense" style={{width: '100px'}}
                onChange={this.handleChange('expiryYear')} required value={expiryYear} variant="outlined"/>
              <div>
              <TextField className={classes.textField} label="CCV" margin="dense" style={{width: '100px'}}
                onChange={this.handleChange('ccv')} required value={ccv} variant="outlined"/>
              </div>
            </div>
          </PortletContent>
          <PortletFooter className={classes.portletFooter}>
            <Button color="primary" variant="contained" onClick={this.savePayment}>
              Save details
            </Button>
            <PortletLabel subtitle={this.state.message} style={{marginTop: '10px'}}/>
          </PortletFooter>
          </form>
        </Portlet>
      );
    }
}

AccountBilling.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

AccountBilling = withStyles(detailsStyles)(AccountBilling);


class AccountContainer extends Component {
  state = { tabIndex: 0 };

  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Account">
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item lg={6} md={6} xl={6} xs={12}>
              <AccountDetails />
            </Grid>
            <Grid item lg={6} md={6} xl={6} xs={12}>
              <AccountBilling />
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

AccountContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export const Account = withStyles(styles)(AccountContainer);
