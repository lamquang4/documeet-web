import axios from "axios";
import { doRefresh, isTokenExpiringSoon } from "../utils/authService";
import { cookieUtil } from "../utils/cookieUtil";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  withCredentials: false,
});

export const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  withCredentials: false,
});

axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = cookieUtil.get("accessToken");
  const refreshToken = cookieUtil.get("refreshToken");

  if (accessToken && refreshToken && isTokenExpiringSoon(accessToken)) {
    const newToken = await doRefresh();
    if (newToken) {
      config.headers.Authorization = `Bearer ${newToken}`;
      return config;
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await doRefresh();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }

    if (status === 403) {
      toast.error("Bạn không có quyền thực hiện thao tác này");
    } else if (status === 500) {
      toast.error("Lỗi server, vui lòng thử lại sau");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
