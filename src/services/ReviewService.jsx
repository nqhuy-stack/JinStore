import { addStart, addSuccess, addFailed, resetAddState } from '@/redux/itemSlice.jsx';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL_V1 ?? import.meta.env.VITE_API_URL_V2;

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

export const addReview = async (data, dispatch, accessToken, axiosJWT) => {
  dispatch(addStart());
  try {
    const response = await axiosJWT.post(`${API_URL}/reviews/create`, data, {
      headers: authHeaders(accessToken),
    });
    dispatch(addSuccess(response.data));
    dispatch(resetAddState());
    return response.data;
  } catch (error) {
    dispatch(addFailed());
    toast.error(error.response?.data.message, { position: 'top-center', duration: 2000 });
    throw error.response?.data.message;
  }
};

export const getReviewByProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/product/${productId}`, {
      headers: defaultHeaders,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data.message;
  }
};
