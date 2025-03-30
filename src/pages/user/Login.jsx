import { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';

import FormLogin from '@components/ui/FormLogin.jsx';
import SocialAccount from '@components/ui/SocialAccount.jsx';

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Fragment>
      <section>
        <div className="login-container">
          <div className="form-describe">
            <p>lorem</p>
          </div>
          <div className="login-main">
            <h1 className="login-heading">Login</h1>
            <p className="login-subtext"></p>
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
        </div>
      </section>
    </Fragment>
  );
};

export default Login;
