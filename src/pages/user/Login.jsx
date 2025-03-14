import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import FormLogin from '@components/ui/FormLogin';
import SocialAccount from '@components/ui/socialAccount';

const Login = () => {
  return (
    <Fragment>
      <section>
        <div className="login-container">
          <h1 className="login-heading">Login</h1>
          <p className="login-subtext">If you have an account, sign in with your username or email address.</p>
          <FormLogin />
          <div className="item-other">
            <span className="line-left"></span>
            <span className="text-or">OR</span>
            <span className="line-right"></span>
          </div>
          <SocialAccount />
          <p>
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </section>
    </Fragment>
  );
};

export default Login;
