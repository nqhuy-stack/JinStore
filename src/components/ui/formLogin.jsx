import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@services/AuthService.jsx';
import { useDispatch } from 'react-redux';

import Button from '@components/ui/Button';

function FormLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = {
    username: username,
    password: password,
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(user, dispatch, navigate);
  };

  return (
    <Fragment>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-field">
          <label>Username*</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div className="login-field">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>
        {/* <div className="login-checkbox-container">
          <div className="login-checkbox-left">
            <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} id="remember-me" />
            <label htmlFor="remember-me" className="login-label">
              Remember me
            </label>
          </div>
          <a href="#" className="login-link">
            Lost your password?
          </a>
        </div> */}
        <Button type="submit" className="btn login-button">
          Login
        </Button>
      </form>
    </Fragment>
  );
}

export default FormLogin;
