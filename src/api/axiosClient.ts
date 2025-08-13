import axios from 'axios';
import { store } from '../store';
import { clearAuthData } from '../store/Auth';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.request.use(
  function (config) {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['ngrok-skip-browser-warning'] = true;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (res) {
    return res;
  },
  function (error) {
    const status = error.response?.status;
    const url = error.config?.url || '';

    if (status === 401 && !url.includes('update-password')) {
      store.dispatch(clearAuthData());
      localStorage.removeItem('persist:root');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
