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
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

//NOTE: Đăng nhập
export const login = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${API_URL}/auth/login`, user, { withCredentials: true });
    dispatch(loginSuccess(res.data));
    toast.success('Đăng nhập thành công!', {
      autoClose: 500,
    });
    navigate('/');
  } catch (err) {
    dispatch(loginFailed());
    throw alert(err.response?.data.message);
  }
};

//NOTE: Đăng xuất
export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
  dispatch(logoutStart());
  try {
    await axiosJWT.post(
      `${API_URL}/auth/logout`,
      { id },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      },
    );

    dispatch(logoutSuccess());
    navigate('/login');
    toast.success('Đăng xuất thành công!', {
      autoClose: 1000,
    });
  } catch (error) {
    console.error('Logout error:', error);
    dispatch(logoutFailed());
  }
};

//NOTE: Đăng ký
export const register = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post(`${API_URL}/auth/register`, user);
    dispatch(registerSuccess());
    toast.success('Đăng ký thành công!');
    navigate('/login');
    toast.success('Đăng ký thành công!', {
      autoClose: 1000,
    });
  } catch (err) {
    dispatch(registerFailed('Something is wrong'));
    throw alert(err.response?.data.message);
  }
};

//NOTE: Danh sách danh mục
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi hệ thống!';
  }
};

// Danh sách sản phẩm theo danh mục
export const getProductsByIdCategory = async (idCategory) => {
  try {
    const response = await axios.get(`${API_URL}/products/category/${idCategory}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi hệ thống!';
  }
};

//Danh sách sản phẩm
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi hệ thống!';
  }
};
