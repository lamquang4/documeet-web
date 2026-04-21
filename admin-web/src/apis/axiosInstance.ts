import axios from "axios";
import toast from "react-hot-toast";
import { cookieUtil } from "../utils/cookieUtil";
import { clearAuthStorage } from "../utils/authUtil";

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Token hết hạn → bắt đăng nhập lại, không refresh
    if (status === 401) {
      clearAuthStorage();
      toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (status === 403) {
      toast.error(message ?? "Bạn không có quyền thực hiện thao tác này");
      return Promise.reject(error);
    }

    if (status === 500) {
      toast.error("Lỗi server, vui lòng thử lại sau");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
