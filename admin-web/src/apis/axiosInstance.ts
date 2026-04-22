import axios from "axios";
import { authApi } from "../apis/authApi";
import {
  doRefresh,
  isTokenExpiringSoon,
  logoutAndRedirect,
  saveTokens,
} from "../utils/authService";
import { cookieUtil } from "../utils/cookieUtil";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  withCredentials: false,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = cookieUtil.get("accessToken");
  const refreshToken = cookieUtil.get("refreshToken");

  // Token sắp hết hạn → refresh trước khi gửi request
  if (accessToken && refreshToken && isTokenExpiringSoon(accessToken)) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const res = await authApi.refresh({ refreshToken });
        saveTokens(res.data);

        const newAccessToken = res.data.accessToken;
        config.headers.Authorization = `Bearer ${newAccessToken}`;

        isRefreshing = false;
        processQueue(null, newAccessToken);
        return config;
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        logoutAndRedirect();
        return Promise.reject(err);
      }
    }

    // Đang refresh → đợi queue
    const token = await new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
    config.headers.Authorization = `Bearer ${token}`;
    return config;
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

    // 403 lần đầu → thử refresh (backend dùng 403 cho token hết hạn)
    if (status === 403 && !originalRequest._retry) {
      const refreshToken = cookieUtil.get("refreshToken");

      if (!refreshToken) {
        logoutAndRedirect();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const newAccessToken = await doRefresh().catch((err) => {
        isRefreshing = false;
        processQueue(err, null);
        return null;
      });

      if (!newAccessToken) return Promise.reject(error);

      isRefreshing = false;
      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    }

    if (status === 403 && originalRequest._retry) {
      toast.error("Bạn không có quyền thực hiện thao tác này");
    } else if (status === 500) {
      toast.error("Lỗi server, vui lòng thử lại sau");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
