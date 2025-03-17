import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import SocialAccount from '@components/ui/SocialAccount.jsx';
import FormRegister from '@components/ui/FormRegister.jsx';

function Register() {
  return (
    <Fragment>
      <section>
        <div className="register-container">
          <h1 className="register-heading">Register</h1>
          <p className="register-subtext">
            There are many advantages to creating an account: the payment process is faster, shipment tracking is
            possible and much more.
          </p>
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
      </section>
    </Fragment>
  );
}

export default Register;
