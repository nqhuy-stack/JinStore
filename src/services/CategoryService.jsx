import { addStart, addSuccess, addFailed, resetAddState } from '@/redux/categoriesSlice.jsx';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

//NOTE: Danh sách danh mục
export const getCategoriesAll = async () => {
  try {
    console.log(`🔍 Fetching categories from: ${API_URL}/categories`);
    const response = await axios.get(`${API_URL}/categories`, {
      timeout: 10000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log(`✅ Received ${response.data.length} categories`);
    if (response.data.length > 0) {
      console.log('📝 First category:', response.data[0]);
    }

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    console.error('Error details:', error.response?.data || error.message);

    const errorMessage = error.response?.data?.message || 'Lỗi hệ thống!';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

//NOTE: lấy danh mục theo chỉ định
export const getCategories = async (id) => {
  try {
    console.log(`🔍 Fetching category with ID: ${id} from: ${API_URL}/categories/${id}`);
    const response = await axios.get(`${API_URL}/categories/${id}`, {
      timeout: 10000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log(`✅ Received category:`, response.data);
    return response.data;
  } catch (err) {
    console.error('❌ Error fetching category:', err);
    console.error('Error details:', err.response?.data || err.message);

    toast.dismiss();
    toast.error(err.response?.data?.message || 'Lỗi hệ thống!', {
      autoClose: 500,
    });
    throw err.response?.data?.message || 'Lỗi hệ thống!';
  }
};

//NOTE: Thêm danh mục mới
export const addCategories = async (formData, dispatch, accessToken, axiosJWT) => {
  dispatch(addStart());
  try {
    const res = await axiosJWT.post(`${API_URL}/categories/create`, formData, {
      headers: {
        token: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
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
    toast.error(err.response?.data.message, {
      autoClose: 500,
    });
    throw err.response?.data.message || 'Lỗi hệ thống!';
  }
};

// NOTE: Cập nhật thông tin cho category
export const editCategory = async (id, formData, accessToken, axiosJWT) => {
  try {
    await axiosJWT.patch(`${API_URL}/categories/update/${id}`, formData, {
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
