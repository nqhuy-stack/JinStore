import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import SocialAccount from '@components/ui/SocialAccount.jsx';
import FormRegister from '@components/ui/FormRegister.jsx';

function Register() {
  return (
    <Fragment>
      <section>
        <div className="register-container">
          <div className="form-describe">
            <p>lorem</p>
          </div>
          <div className="register-main">
            <h1 className="register-heading">Register</h1>
            <p className="register-subtext"></p>
            <FormRegister />
            <div className="item-other">
              <span className="line-left"></span>
              <span className="text-or">OR</span>
              <span className="line-right"></span>
            </div>
            <SocialAccount />
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Register;
