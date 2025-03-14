import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '~/services/AuthService';

import Button from '@components/ui/Button';
function FormRegister() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      console.log(formData.password, formData.confirmPassword);
      setMessage('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      const response = await registerUser(formData);
      setMessage(response.message);

      // Lưu email vào localStorage để tự động điền vào Login
      localStorage.setItem('email', formData.email);
      localStorage.setItem('name', formData.name);

      // Chuyển hướng sang trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setMessage(error.message || 'Lỗi đăng ký!');
    }
  };

  return (
    <Fragment>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-field">
          <label>Username *</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="register-input"
          />
        </div>
        <div className="register-field">
          <label>Email address *</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="register-input"
          />
        </div>
        <div className="register-field">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={handleChange}
            required
            className="register-input"
          />
        </div>
        <div className="register-field">
          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            onChange={handleChange}
            required
            className="register-input"
          />
        </div>
        <p className="privacy-text">
          Your personal data will be used to support your experience throughout this website, to manage access to your
          account, and for other purposes described in our
          <Link to="/privacy-policy"> privacy policy</Link>.
        </p>
        <Button type="submit" className="btn register-button">
          Register
        </Button>
      </form>
      {message && <p>{message}</p>}
    </Fragment>
  );
}

export default FormRegister;
