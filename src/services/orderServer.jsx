import { addStart, addSuccess, addFailed, resetAddState } from '@/redux/itemSlice.jsx';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL_V1 || import.meta.env.VITE_API_URL_V2;

// Cấu hình header mặc định
const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// Cấu hình header cho yêu cầu có token
const authHeaders = (accessToken) => ({
  token: `Bearer ${accessToken}`,
  ...defaultHeaders,
});

export const createOrder = async (data, dispatch, accessToken, axiosJWT) => {
  if (!data || !dispatch || !accessToken || !axiosJWT) {
    toast.error('Vui lòng thử lại!', { duration: 2000 });
    throw new Error('Dữ liệu đầu vào không hợp lệ!');
  }

  try {
    dispatch(addStart());
    const res = await axiosJWT.post(`${API_URL}/orders/create`, data, {
      headers: authHeaders(accessToken),
    });
    dispatch(addSuccess());
    toast.success('Tạo đơn hàng thành công!', { duration: 2000 });
    dispatch(resetAddState());

    if (data.source === 'cart') {
      const storedCount = parseInt(sessionStorage.getItem('itemCount') || '0', 10);
      const itemCount = storedCount - data.orderItems.length;
      sessionStorage.setItem('itemCount', itemCount.toString());
      window.dispatchEvent(new CustomEvent('itemCountChanged', { detail: itemCount }));
    }
    return res.data;
  } catch (error) {
    dispatch(addFailed(error.response?.data.message));
    toast.error(error.response?.data.message, { duration: 2000 });
  }
};

export const getOrdersStatus = async (status, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.get(`${API_URL}/orders/status?status=${status}`, {
      headers: authHeaders(accessToken),
    });
    return res.data;
  } catch (error) {
    toast.error(error.response?.data.message, { duration: 2000 });
  }
};
