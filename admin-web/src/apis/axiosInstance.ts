import axios from "axios";
import toast from "react-hot-toast";
import { cookieUtil } from "../utils/cookieUtil";
import { logoutAndRedirect } from "../utils/authUtil";
import { authApi } from "../apis/authApi";
import { COOKIE_EXPIRES, COOKIE_OPTIONS } from "../constant/cookieConstant";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = cookieUtil.get("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = cookieUtil.get("refreshToken");
        if (!refreshToken) throw new Error("Không có refresh token");

        const res = await authApi.refresh({ refreshToken });
        const newAccessToken = res.data.accessToken;

        // accessToken mới
        cookieUtil.set("accessToken", newAccessToken, {
          ...COOKIE_OPTIONS,
          expires: res.data.expiresIn / 86400,
        });

        // refreshToken mới
        if (res.data?.refreshToken) {
          cookieUtil.set("refreshToken", res.data.refreshToken, {
            ...COOKIE_OPTIONS,
            expires: COOKIE_EXPIRES.refresh,
          });
        }

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await logoutAndRedirect();
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      toast.error(message ?? "Bạn không có quyền thực hiện thao tác này");
    } else if (status === 500) {
      toast.error("Lỗi server, vui lòng thử lại sau");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
