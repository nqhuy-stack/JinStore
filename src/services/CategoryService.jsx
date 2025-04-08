import { addStart, addSuccess, addFailed, resetAddState } from '@/redux/categoriesSlice.jsx';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

//NOTE: Danh sách danh mục
export const getCategoriesAll = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`, { timeout: 10000 });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Lỗi hệ thống!';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const getCategories = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`, { timeout: 10000 });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Lỗi hệ thống!';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const addCategories = async (data, dispatch, accessToken, axiosJWT) => {
  dispatch(addStart());
  try {
    const res = await axiosJWT.post(`${API_URL}/categories/create`, data, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    dispatch(addSuccess(res.data));
    toast.dismiss();
    toast.success('Thêm danh mục thành công!', {
      autoClose: 500,
    });
    dispatch(resetAddState());
  } catch (err) {
    dispatch(addFailed(err.data));
    toast.dismiss();
    toast.error('Thêm danh mục thất bại!', {
      autoClose: 500,
    });
    throw err.response?.data || 'Lỗi hệ thống!';
  }
};

// NOTE: Cập nhật trạng thái cho category
export const editStatus = async (id, status, accessToken, axiosJWT) => {
  try {
    await axiosJWT.patch(
      `${API_URL}/categories/update/${id}`,
      { status },
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    toast.dismiss();
    toast.success('Thay đổi trạng thái thành công!', {
      autoClose: 500,
    });
  } catch (err) {
    toast.dismiss();
    toast.error(err.response?.data, {
      autoClose: 500,
    });
  }
};
