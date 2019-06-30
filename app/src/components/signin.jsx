import { usersService } from '../services/users';

export const defineSignInComponent = (OriginalSignIn) => {
    class SignIn extends OriginalSignIn {
        handleSignIn = async () => {
            this.setState({isLoading: true, errors: {}});
            try {
                const { history } = this.props;
                const {values} = this.state;
                const result = await usersService.signin(values.email, values.password);
                localStorage.setItem('userInfo', JSON.stringify(result));
                history.push('/dashboard');
            } catch (error) {
                this.setState({errors: {email: ['Invalid username or password.']}});
            }
            this.setState({isLoading: false});
        }
    }
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
    }
    return SignUp;
};
