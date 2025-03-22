import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFailed,
  logoutStart,
  logoutSuccess,
  logoutFailed,
} from '@/redux/authSlice.jsx';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://jinstore-api.onrender.com';

// Đăng ký tài khoản
export const login = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${API_URL}/auth/login`, user);
    dispatch(loginSuccess(res.data));
    navigate('/');
  } catch (err) {
    dispatch(loginFailed());
    throw alert(err.response?.data.message);
  }
};

export const logOut = async (dispatch, navigate) => {
  dispatch(logoutStart());
  try {
    dispatch(logoutSuccess());
    navigate('/login');
  } catch {
    dispatch(logoutFailed());
  }
};

export const register = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post(`${API_URL}/auth/register`, user);
    dispatch(registerSuccess());
    navigate('/login');
  } catch (err) {
    dispatch(registerFailed('Something is wrong'));
    throw alert(err.response?.data.message);
  }
};

// Danh sách danh mục
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi hệ thống!';
  }
};

// Danh sách sản phẩm theo danh mục
export const getProductsByCategory = async (idCategory) => {
  if (!idCategory) {
    throw new Error('idCategory không được để trống');
  }

  try {
    const response = await axios.get(`${API_URL}/products/category/${idCategory}`);
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Lỗi khi lấy sản phẩm');
  }
};
