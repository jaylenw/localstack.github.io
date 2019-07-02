import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { usersService } from '../services/users';

// Material components
import {
  Grid,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  Checkbox,
  Typography
} from '@material-ui/core';

// Material icons
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

const leftPanel = (classes) => (
  <Grid className={classes.quoteWrapper} item lg={5}>
    <div className={classes.quote}>
      <div className={classes.quoteInner}>
        <img alt="LocalStack" className={classes.logoImage} src="/images/logos/localstack.png"/>
        <Typography className={classes.quoteText} variant="h1">
          LocalStack
        </Typography>
      </div>
    </div>
  </Grid>
);

const sharedStyles = {
    logoImage: {
        width: '250px'
    },
    quoteText: {
        color: '#000',
        marginTop: '20px'
    }
};

export const defineSignInComponent = (OriginalSignIn) => {
    class SignIn extends OriginalSignIn {
        handleSignIn = async () => {
            this.setState({isLoading: true, errors: {}});
            try {
                const { history } = this.props;
                const {values} = this.state;
                const result = await usersService.signin(values.email, values.password);
                localStorage.setItem('userInfo', JSON.stringify(result));
                this.props.dispatch({type: 'USER_UPDATE', payload: result});
                history.push('/dashboard');
            } catch (error) {
                // TODO: define better logging
                console.log(error);
                this.setState({errors: {email: ['Error logging in - please check email and password.']}});
            }
            this.setState({isLoading: false});
        }

        render() {
            const { classes } = this.props;
            const { values, touched, errors, isValid, submitError, isLoading } = this.state;
            const showEmailError = touched.email && errors.email;
            const showPasswordError = touched.password && errors.password;

            return (
              <div className={classes.root}>
                <Grid className={classes.grid} container>
                  {leftPanel(classes)}
                  <Grid className={classes.content} item lg={7} xs={12}>
                    <div className={classes.content}>
                      <div className={classes.contentHeader}>
                        <IconButton className={classes.backButton} onClick={this.handleBack}>
                          <ArrowBackIcon />
                        </IconButton>
                      </div>
                      <div className={classes.contentBody}>
                        <form className={classes.form}>
                          <Typography className={classes.title} variant="h2">
                            Sign in
                          </Typography>
                          <div className={classes.fields}>
                            <TextField
                              className={classes.textField} label="Email address" name="email"
                              onChange={event => this.handleFieldChange('email', event.target.value)}
                              type="text" value={values.email} variant="outlined"/>
                            {showEmailError && (
                              <Typography className={classes.fieldError} variant="body2">
                                {errors.email[0]}
                              </Typography>
                            )}
                            <TextField className={classes.textField} label="Password" name="password"
                              onChange={event => this.handleFieldChange('password', event.target.value)}
                              type="password" value={values.password} variant="outlined"/>
                            {showPasswordError && (
                              <Typography className={classes.fieldError} variant="body2">
                                {errors.password[0]}
                              </Typography>
                            )}
                          </div>
                          {submitError && (
                            <Typography className={classes.submitError} variant="body2">
                              {submitError}
                            </Typography>
                          )}
                          {isLoading ? (
                            <CircularProgress className={classes.progress} />
                          ) : (
                            <Button className={classes.signInButton} color="primary" disabled={!isValid}
                              onClick={this.handleSignIn} size="large" variant="contained">
                              Sign in now
                            </Button>
                          )}
                          <Typography className={classes.signUp} variant="body1">
                            Don't have an account?{' '}
                            <Link className={classes.signUpUrl} to="/sign-up">
                              Sign up
                            </Link>
                          </Typography>
                        </form>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            );
        }
    }

    SignIn.styles = sharedStyles;

    const mapDispatchToProps = (dispatch) => {
        return {};
    };
    SignIn = connect(mapDispatchToProps)(SignIn);
    return SignIn;
};

export const defineSignUpComponent = (OriginalSignUp) => {
    class SignUp extends OriginalSignUp {
        handleSignUp = async () => {
            try {
              const { history } = this.props;
              const { values } = this.state;
              this.setState({ isLoading: true });
              await usersService.signup(values.firstName,
                  values.lastName, values.email, values.password);
              history.push('/sign-in');
            } catch (error) {
              this.setState({errors: {password: [
                'Unable to sign up with the given information. If you already have an account, please sign in.'
              ]}});
            }
            this.setState({isLoading: false});
        };

        render() {
          const { classes } = this.props;
          const { values, touched, errors, isValid, submitError, isLoading } = this.state;

          const showFirstNameError =
            touched.firstName && errors.firstName ? errors.firstName[0] : false;
          const showLastNameError =
            touched.lastName && errors.lastName ? errors.lastName[0] : false;
          const showEmailError =
            touched.email && errors.email ? errors.email[0] : false;
          const showPasswordError =
            touched.password && errors.password ? errors.password[0] : false;
          const showPolicyError =
            touched.policy && errors.policy ? errors.policy[0] : false;

          return (
            <div className={classes.root}>
              <Grid className={classes.grid} container>
                {leftPanel(classes)}
                <Grid className={classes.content} item lg={7} xs={12}>
                  <div className={classes.content}>
                    <div className={classes.contentHeader}>
                      <IconButton className={classes.backButton} onClick={this.handleBack}>
                        <ArrowBackIcon />
                      </IconButton>
                    </div>
                    <div className={classes.contentBody}>
                      <form className={classes.form}>
                        <Typography className={classes.title} variant="h2">
                          Sign up
                        </Typography>
                        <Typography className={classes.subtitle} variant="body1">
                          Use your email to create a new account.
                        </Typography>
                        <div className={classes.fields}>
                          <TextField className={classes.textField}
                            label="First name" name="firstName"
                            onChange={event => this.handleFieldChange('firstName', event.target.value)}
                            value={values.firstName} variant="outlined"/>
                          {showFirstNameError && (
                            <Typography className={classes.fieldError} variant="body2">
                              {errors.firstName[0]}
                            </Typography>
                          )}
                          <TextField className={classes.textField} label="Last name"
                            onChange={event => this.handleFieldChange('lastName', event.target.value)}
                            value={values.lastName} variant="outlined"/>
                          {showLastNameError && (
                            <Typography className={classes.fieldError} variant="body2">
                              {errors.lastName[0]}
                            </Typography>
                          )}
                          <TextField className={classes.textField} label="Email address" name="email"
                            onChange={event => this.handleFieldChange('email', event.target.value)}
                            value={values.email} variant="outlined"
                          />
                          {showEmailError && (
                            <Typography className={classes.fieldError} variant="body2">
                              {errors.email[0]}
                            </Typography>
                          )}
                          <TextField className={classes.textField} label="Password"
                            onChange={event => this.handleFieldChange('password', event.target.value)}
                            type="password" value={values.password} variant="outlined"/>
                          {showPasswordError && (
                            <Typography className={classes.fieldError} variant="body2">
                              {errors.password[0]}
                            </Typography>
                          )}
                          <div className={classes.policy}>
                            <Checkbox checked={values.policy} className={classes.policyCheckbox}
                              color="primary" name="policy"
                              onChange={() => this.handleFieldChange('policy', !values.policy)}/>
                            <Typography className={classes.policyText} variant="body1">
                              I have read the &nbsp;
                              <Link className={classes.policyUrl} to="#">
                                Terms and Conditions
                              </Link>
                              .
                            </Typography>
                          </div>
                          {showPolicyError && (
                            <Typography className={classes.fieldError} variant="body2">
                              {errors.policy[0]}
                            </Typography>
                          )}
                        </div>
                        {submitError && (
                          <Typography className={classes.submitError} variant="body2">
                            {submitError}
                          </Typography>
                        )}
                        {isLoading ? (
                          <CircularProgress className={classes.progress} />
                        ) : (
                          <Button className={classes.signUpButton} color="primary" disabled={!isValid}
                            onClick={this.handleSignUp} size="large" variant="contained">
                            Sign up now
                          </Button>
                        )}
                        <Typography className={classes.signIn} variant="body1">
                          Have an account?{' '}
                          <Link className={classes.signInUrl} to="/sign-in">
                            Sign In
                          </Link>
                        </Typography>
                      </form>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          );
        }
    }

    SignUp.styles = sharedStyles;

    return SignUp;
};
