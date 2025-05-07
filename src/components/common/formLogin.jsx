import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@services/AuthService.jsx';
import { useDispatch } from 'react-redux';
import { LuEye, LuEyeClosed } from 'react-icons/lu';

import Button from '@components/common/Button';
import PageLoad from '@pages/pageLoad';

function FormLogin() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const user = {
    usernameOrEmail: usernameOrEmail,
    password: password,
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await login(user, dispatch, navigate);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      {isLoading ? (
        <PageLoad zIndex="9999" />
      ) : (
        <form className="block__form" onSubmit={handleSubmit}>
          <div className="form__field">
            <label>Username Or Email*</label>
            <div className="form__field-input">
              <input
                type="text"
                name="usernameOrEmail"
                placeholder="Username or Email"
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form__field">
            <label>Password *</label>
            <div className="form__field-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button className="see-password" onClick={togglePasswordVisibility}>
                {showPassword ? <LuEye className="icon-eye" /> : <LuEyeClosed className="icon-eye" />}
              </Button>
            </div>
          </div>
          <span className="link-resetPassword">
            <Link to="/resetPassword">Forgot password ?</Link>
          </span>
          <Button type="submit" className="btn btn__submit-account" loading={isLoading}>
            Login
          </Button>
        </form>
      )}
    </Fragment>
  );
}

export default FormLogin;
