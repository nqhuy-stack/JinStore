import axios from 'axios';
import { toast } from 'react-hot-toast';
const API_URL = import.meta.env.VITE_API_URL;

//NOTE: Danh sách danh mục
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi hệ thống!';
  }
};

export const addCategories = async (data, dispatch, accessToken, axiosJWT) => {
  try {
    await axiosJWT.post(`${API_URL}/create`, data, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });

    toast.dismiss();
    toast.success('Đăng xuất thành công!', {
      autoClose: 500,
    });
    
  } catch (err) {
    throw err.response?.data || 'Lỗi hệ thống!';
  }
};
