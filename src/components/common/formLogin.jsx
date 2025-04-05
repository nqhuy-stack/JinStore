import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@services/AuthService.jsx';
import { useDispatch } from 'react-redux';
import { LuEye, LuEyeClosed } from 'react-icons/lu';

import Button from '@components/common/Button';

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
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-field">
          <label>Username Or Email*</label>
          <div className="field_input">
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
        </div>
        <div className="login-field">
          <label>Password *</label>
          <div className="field_input">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <Button className="see-password" onClick={togglePasswordVisibility}>
              {showPassword ? <LuEye className="icon-eye" /> : <LuEyeClosed className="icon-eye" />}
            </Button>
          </div>
        </div>
        <span className="login-resetPassword">
          <Link to="/resetPassword">Forgot password ?</Link>
        </span>
        <Button type="submit" className="btn login-button" loading={isLoading}>
          Login
        </Button>
      </form>
    </Fragment>
  );
}

export default FormLogin;
