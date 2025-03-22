import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || 'https://jinstore-api.onrender.com';

const refreshToken = async () => {
  try {
    const res = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      {
        withCredentials: true, // This should be an option, not in the request body
      },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err; // Important: rethrow the error to handle it in the calling function
  }
};

export const createAxios = (user, dispatch, stateSuccess) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      if (user?.accessToken) {
        // Check if user and token exist
        const date = new Date();
        try {
          const decodedToken = jwtDecode(user.accessToken);
          if (decodedToken.exp < date.getTime() / 1000) {
            const data = await refreshToken();
            const refreshUser = {
              ...user,
              accessToken: data.accessToken,
            };
            dispatch(stateSuccess(refreshUser));
            config.headers['token'] = 'Bearer ' + data.accessToken;
          } else {
            // Token still valid, set the existing token
            config.headers['token'] = 'Bearer ' + user.accessToken;
          }
        } catch (err) {
          console.error('Token decode error:', err);
          // Handle invalid token errors
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );
  return newInstance;
};
