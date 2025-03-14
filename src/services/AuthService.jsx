import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL || 'https://jinstore-api.onrender.com';

// Đăng ký tài khoản
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi hệ thống!';
  }
};

// Đăng nhập
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Sai tài khoản hoặc mật khẩu!';
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
