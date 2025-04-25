import { addStart, addSuccess, addFailed, resetAddState } from '@/redux/itemSlice.jsx';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL_V1 || import.meta.env.VITE_API_URL_V2;

// Cấu hình header mặc định
const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// Cấu hình header cho form-data
const formDataHeaders = (accessToken) => ({
  token: `Bearer ${accessToken}`,
  'Content-Type': 'multipart/form-data',
});

// Cấu hình header cho yêu cầu có token
const authHeaders = (accessToken) => ({
  token: `Bearer ${accessToken}`,
  ...defaultHeaders,
});

// NOTE: Create discount
export const addDiscount = async (formData, dispatch, accessToken, axiosJWT) => {
  if (!formData || !accessToken || !axiosJWT) {
    toast.error('Dữ liệu đầu vào không hợp lệ!', { duration: 2000 });
    throw new Error('Dữ liệu đầu vào không hợp lệ!');
  }

  return toast.promise(
    async () => {
      dispatch(addStart());
      const res = await axiosJWT.post(`${API_URL}/discounts/create`, formData, {
        headers: formDataHeaders(accessToken),
      });
      dispatch(addSuccess(res.data));
      dispatch(resetAddState());
      return res.data;
    },
    {
      loading: 'Đang thêm mã giảm giá...',
      success: <b>Thêm mã giảm giá thành công thành công!</b>,
      error: (error) => {
        const errorMessage = error.response?.data?.message || 'Lỗi hệ thống!';
        dispatch(addFailed(errorMessage));
        return <b>{errorMessage}</b>;
      },
    },
    {
      success: { duration: 2000 }, // Tùy chỉnh thời gian hiển thị cho success
      error: { duration: 2000 }, // Tùy chỉnh thời gian hiển thị cho error
    },
  );
};
