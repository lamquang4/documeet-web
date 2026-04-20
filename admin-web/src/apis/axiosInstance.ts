import axios from "axios";
import toast from "react-hot-toast";
import { cookieUtil } from "../utils/cookieUtil";
import { clearAuth } from "../utils/authUtil";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = cookieUtil.get("accessToken");

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
    const message = error.response?.data?.message;

    // Token hết hạn → thử refresh 1 lần
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = cookieUtil.get("refreshToken") ?? "";
        const res = await axiosInstance.post("/api/auth/refresh", {
          refreshToken,
        });

        const newToken = res.data?.data?.accessToken;

        if (newToken) {
          cookieUtil.set("accessToken", newToken, {
            secure: true,
            sameSite: "None",
          });
        }

        return axiosInstance(originalRequest);
      } catch {
        clearAuth();
        window.location.href = "/";
        return Promise.reject(error);
      }
    }

    // Không có quyền
    if (status === 403) {
      toast.error(message ?? "Bạn không có quyền thực hiện thao tác này");
      return Promise.reject(error);
    }

    // Lỗi server
    if (status === 500) {
      toast.error("Lỗi server, vui lòng thử lại sau");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
