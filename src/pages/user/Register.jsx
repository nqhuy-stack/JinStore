import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import SocialAccount from '@components/common/SocialAccount.jsx';
import FormRegister from '@components/common/FormRegister.jsx';
import FormDescribe from '@components/common/formDescribe';

function Register() {
  return (
    <Fragment>
      <section className="register-container">
        <FormDescribe>
          Hãy đăng ký để khám phá thế giới của chúng tôi và cùng nhau xây dựng một tương lai bền vững.
        </FormDescribe>
        <div className="register-main">
          <h1 className="register-heading">Đăng ký</h1>
          <p className="register-subtext">Vui lòng nhập thông tin đăng ký của bạn</p>
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
