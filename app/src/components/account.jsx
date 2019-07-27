import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { injectStripe, StripeProvider, Elements,
  CardNumberElement, CardCVCElement, CardExpiryElement
} from 'react-stripe-elements';

import { usersService } from '../services/users';
import { stripePublicKey } from '../config';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'react-material-dashboard/src/components';

import { default as detailsStyles } from 'react-material-dashboard/src/views/Account/components/AccountDetails/styles';

// Material components
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  withStyles
} from '@material-ui/core';

import { InfoOutlined as InfoIcon } from '@material-ui/icons';

// Shared layouts
import { Dashboard as DashboardLayout } from 'react-material-dashboard/src/layouts';

// Material components
import { Button, TextField, Grid } from '@material-ui/core';

// Component styles
const styles = theme => ({
  root: {

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

export class Password extends Component {
  state = {
    password: '',
    confirm: '',
    updating: false
  };

  handleChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.value });
  };

  isValidPassword = (password) => {
    return password.match(/^\S{7,}/g);
  };

  savePassword = () => {
    this.setState({ message: '', errorMessage: '' });
    const password = this.state.password;
    if (password !== this.state.confirm) {
      return this.setState({ errorMessage: 'Passwords do not match' });
    }
    if (!this.isValidPassword(password)) {
      return this.setState({ errorMessage: 'Please choose a more complex password' });
    }
    this.setState({updating: true});
    usersService.updatePassword(password).then(
      (result) => {
        this.setState({ message: 'Password successfully updated',
          password: '', confirm: '', updating: false });
      }
    )
  };

  render() {
    const { classes, className, ...rest } = this.props;
    const { password, confirm } = this.state;
    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet {...rest} className={rootClassName}>
        <PortletHeader>
          <PortletLabel subtitle="Update password" title="Password"/>
        </PortletHeader>
        <PortletContent>
          <TextField className={classes.textField} type="password" onChange={this.handleChange('password')}
            label="New password" margin="dense" required value={password} variant="outlined"/>
          <TextField className={classes.textField} type="password" onChange={this.handleChange('confirm')}
            label="Confirm password" margin="dense" required value={confirm} variant="outlined"/>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button color="primary" variant="contained" disabled={this.state.updating}
            onClick={this.savePassword}>Update</Button>
          <PortletLabel subtitle={this.state.message} style={{marginTop: '10px'}}/>
          <div style={{marginTop: '10px', color: 'red'}}>{this.state.errorMessage}</div>
        </PortletFooter>
      </Portlet>
    );
  }
}

Password.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

Password = withStyles(styles)(Password);


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
      phone: metadata.phone || '',
      metadata: metadata
    };
    this.setState(this.state);
  }

  saveUser = async () => {
    this.setState({message: '', saving: true});
    try {
      await usersService.saveUserDetails(this.state);
      this.props.dispatch({type: 'USER_UPDATE', payload: this.state});
      this.setState({message: 'Details successfully updated', saving: false});
    } catch (e) {
      this.setState({message: 'Unknown error occurred', saving: false});
    }
  }

  render() {
    const { classes, className, dispatch, ...rest } = this.props;
    const { firstname, lastname, phone, address, country, email } = this.state;
    const rootClassName = classNames(classes.root, className);
    const isLoading = !this.state.metadata;

    return (
      <Portlet {...rest} className={rootClassName}>
        <form autoComplete="off" noValidate onSubmit={this.saveUser}>
        <PortletHeader>
          <PortletLabel subtitle="Update your personal details below" title="Profile"/>
        </PortletHeader>
        {isLoading && (
          <div className={classes.progressWrapper + ' centeredPanel'}>
            <CircularProgress />
          </div>
        )}
        {!isLoading &&
        <>
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
          <Button color="primary" variant="contained" onClick={this.saveUser} disabled={this.state.saving}>
            Save details
          </Button>
          <PortletLabel subtitle={this.state.message} style={{marginTop: '10px'}}/>
        </PortletFooter>
        </>
        }
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
    state = {
      currentCard: null
    }

    componentDidMount() {
      usersService.getCreditCard().then(
        currentCard => this.setState({currentCard})
      );
    }

    handleChange = name => event => {
      this.setState({ ...this.state, [name]: event.target.value });
    };

    savePayment = (ev) => {
      ev.preventDefault();
      const request = {type: 'card'};
      this.setState({saving: true});
      this.props.stripe.createToken(request).then(
        token => {
          if (!token.token) return;
          const card = {
            token: token.token.id
          };
          usersService.saveCreditCard(card).then(
            currentCard => {
              alert('Payment details successfully updated.');
              this.setState({currentCard, newCard: false});
            }
          ).finally(
            () => this.setState({saving: false})
          );
        }
      ).catch(
        () => this.setState({saving: false})
      );
    };

    render() {
      const { classes, className, ...rest } = this.props;
      const { cardNumber, expiryMonth, expiryYear, ccv } = this.state;
      const rootClassName = classNames(classes.root, className);
      const isLoading = !this.state.currentCard;
      return (
        <Portlet {...rest} className={rootClassName}>
          <form autoComplete="off" noValidate onSubmit={this.savePayment}>
            <PortletHeader>
              <PortletLabel subtitle="Billing details listed below" title="Billing"/>
            </PortletHeader>
            {isLoading && (
              <div className={classes.progressWrapper + ' centeredPanel'}>
                <CircularProgress />
              </div>
            )}
            {!isLoading &&
            <>
            <PortletContent noPadding>
              <div className={classes.field}>
                {this.state.currentCard ?
                  <>
                    <b>Current card:</b> ends with <b>{this.state.currentCard.last4}</b>
                  </> :
                  'No card defined yet.'
                }
                {!this.state.newCard &&
                <div style={{marginTop: '10px'}}>
                <Button onClick={() => this.setState({newCard: true})}
                  color="primary" variant="outlined">Add New Card</Button>
                </div>
                }
              </div>
            </PortletContent>
            </>}
            {this.state.newCard &&
            <>
              <PortletContent>
                <div>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell style={{width: '150px'}}>Card Number</TableCell>
                        <TableCell><CardNumberElement style={{base: {fontSize: '17px'}}}/></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Expiry</TableCell>
                        <TableCell><CardExpiryElement style={{base: {fontSize: '17px'}}}/></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>CVC</TableCell>
                        <TableCell><CardCVCElement style={{base: {fontSize: '17px'}}}/></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div style={{display: 'none'}}>
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
                </div>
              </PortletContent>
              <PortletFooter className={classes.portletFooter}>
                <Button type="submit" color="primary" variant="contained" disabled={this.state.saving}>
                  Update Payment Details
                </Button>
                <div style={{marginTop: '10px'}}>
                  <InfoIcon style={{marginBottom: '-5px'}}/> Secure payment provided by <a href="https://stripe.com">Stripe</a>.
                </div>
                <PortletLabel subtitle={this.state.message} style={{marginTop: '10px'}}/>
              </PortletFooter>
            </>
            }
          </form>
        </Portlet>
      );
    }
}

AccountBilling.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

AccountBilling = withStyles(detailsStyles)(injectStripe(AccountBilling));


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
              <StripeProvider apiKey={stripePublicKey}>
                <Elements>
                  <AccountBilling />
                </Elements>
              </StripeProvider>
              <Grid item md={12} xs={12} style={{marginTop: '20px'}}>
                <Password />
              </Grid>
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
