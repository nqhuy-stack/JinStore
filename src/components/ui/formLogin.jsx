import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '~/services/AuthService';

import Button from '@components/ui/Button';

function FormLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const registerEmail = localStorage.getItem('email');
    if (registerEmail) {
      setFormData({ ...formData, email: registerEmail });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      setMessage('Đăng nhập thành công!');
      console.log(response.token);
      console.log(response.user.name);
      if (response.token) {
        localStorage.setItem('token', response.token); // Lưu vào localStorage
        localStorage.setItem('name', response.user.name); // Lưu vào localStorage
        navigate('/', { replace: true });
        window.location.reload(); // Reload trang
      }
    } catch (error) {
      setMessage(error.message || 'Sai thông tin đăng nhập!');
    }
  };
  return (
    <Fragment>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-field">
          <label>Username or email address *</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
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
            onChange={handleChange}
            required
            className="login-input"
          />
        </div>
        {/*       <div className="login-checkbox-container">
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
      {message && <p>{message}</p>}
    </Fragment>
  );
}

export default FormLogin;
