import { addStart, addSuccess, addFailed, resetAddState } from '@/redux/categoriesSlice.jsx';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

//NOTE: Danh sách danh mục
export const getCategoriesAll = async () => {
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
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.dismiss();
    toast.success('Cập nhật thành công!', {
      autoClose: 500,
    });
  } catch (err) {
    toast.dismiss();
    toast.error(err.response?.data.message, {
      autoClose: 500,
    });
    throw err.response?.data.message || 'Lỗi hệ thống!';
  }
};

//NOTE: Xóa danh mục
export const deleteCategory = async (id, accessToken, axiosJWT) => {
  try {
    await axiosJWT.delete(`${API_URL}/categories/delete/${id}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    toast.dismiss();
    toast.success('Xóa thành công thành công!', {
      autoClose: 500,
    });
  } catch (err) {
    toast.dismiss();
    toast.error(err.response?.data.message, {
      autoClose: 500,
    });
    throw err.response?.data.message || 'Lỗi hệ thống!';
  }
};
