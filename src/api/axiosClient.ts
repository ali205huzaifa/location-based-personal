import axios from "axios";
import { store } from "../store";
import { clearAuthData } from "../store/Auth";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["ngrok-skip-browser-warning"] = true;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const message = error.response?.data?.message;

    const isChangePassword =
      url.includes("change-password") || url.includes("update-password");

    if (
      status === 401 &&
      !isChangePassword &&
      message !== "Current password is incorrect"
    ) {
      store.dispatch(clearAuthData());
      localStorage.removeItem("persist:root");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
