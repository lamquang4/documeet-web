import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../apis/authApi";
import { COOKIE_EXPIRES, COOKIE_OPTIONS } from "../constant/cookieConstant";
import type { AccessTokenPayload } from "../types/type";
import { logoutAndRedirect } from "../utils/authUtil";
import { cookieUtil } from "../utils/cookieUtil";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  withCredentials: false,
});

// Refresh queue
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

// Helper
const isTokenExpiringSoon = (token: string, thresholdSeconds = 60): boolean => {
  try {
    const decoded = jwtDecode<AccessTokenPayload>(token);
    return decoded.exp - Date.now() / 1000 < thresholdSeconds;
  } catch {
    return false;
  }
};

const saveTokens = (res: Awaited<ReturnType<typeof authApi.refresh>>) => {
  cookieUtil.set("accessToken", res.data.accessToken, {
    ...COOKIE_OPTIONS,
    expires: res.data.expiresIn / 86400,
  });

  if (res.data?.refreshToken) {
    cookieUtil.set("refreshToken", res.data.refreshToken, {
      ...COOKIE_OPTIONS,
      expires: COOKIE_EXPIRES.refresh,
    });
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = cookieUtil.get("accessToken");
  const refreshToken = cookieUtil.get("refreshToken");

  // Token sắp hết hạn → proactive refresh
  if (accessToken && refreshToken && isTokenExpiringSoon(accessToken)) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const res = await authApi.refresh({ refreshToken });
        saveTokens(res);

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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 403 lần đầu → thử refresh (có thể do token hết hạn)
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

      try {
        const res = await authApi.refresh({ refreshToken });
        saveTokens(res);

        const newAccessToken = res.data.accessToken;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        isRefreshing = false;
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        logoutAndRedirect();
        return Promise.reject(err);
      }
    }

    // 403 lần 2 (sau khi đã retry) → thật sự không có quyền
    if (status === 403 && originalRequest._retry) {
      toast.error("Bạn không có quyền thực hiện thao tác này");
    } else if (status === 500) {
      toast.error("Lỗi server, vui lòng thử lại sau");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
