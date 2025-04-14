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
// import { toast } from 'react-toastify';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

//NOTE: Đăng nhập
export const login = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${API_URL}/auth/login`, user, { withCredentials: true });

    dispatch(loginSuccess(res.data));

    toast.dismiss();
    toast.success('Đăng nhập thành công!', {
      autoClose: 1,
    });
    if (res.data.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  } catch (error) {
    dispatch(loginFailed());
    toast.dismiss();
    toast.error(error.response?.data.message, {
      autoClose: 1000,
    });
  }
};

//NOTE: Đăng xuất
export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
  dispatch(logoutStart());
  try {
    // Xóa dữ liệu local trước
    localStorage.removeItem('persist:root');

    // Chỉ gọi API logout nếu có id và accessToken
    if (id && accessToken && axiosJWT) {
      try {
        await axiosJWT.post(
          `${API_URL}/auth/logout`,
          { id },
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          },
        );
      } catch (error) {
        console.error('Error calling logout API:', error);
        toast.dismiss();
        toast.error(error.response?.data.message, {
          autoClose: 1000,
        });
      }
    }

    // Dispatch action và thông báo
    dispatch(logoutSuccess());

    toast.dismiss();
    toast.success('Đăng xuất thành công!', {
      autoClose: 1000,
    });

    // Điều hướng về trang chủ
    navigate('/');
  } catch (error) {
    console.error('Logout error:', error);
    dispatch(logoutFailed());
    toast.dismiss();
    toast.error(error.response?.data.message, {
      autoClose: 1000,
    });
  }
};

//NOTE: Đăng ký
export const register = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post(`${API_URL}/auth/register`, user);
    dispatch(registerSuccess());

    toast.dismiss();
    toast.success('Đăng ký thành công!', {
      autoClose: 1000,
    });

    navigate('/login');
  } catch (error) {
    dispatch(registerFailed('Something is wrong'));
    toast.dismiss();
    toast.error(error.response?.data.message, {
      autoClose: 1000,
    });
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
