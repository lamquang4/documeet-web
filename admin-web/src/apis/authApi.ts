import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
} from "../types/type";
import axiosInstance from "./axiosInstance";

const BASE = "/api/auth";

export const authApi = {
  // POST /auth/login
  login: (data: LoginRequest) =>
    axiosInstance
      .post<ApiResponse<LoginResponse>>(`${BASE}/login`, data)
      .then((r) => r.data),

  // POST /auth/logout
  logout: (data: LogoutRequest) =>
    axiosInstance
      .post<ApiResponse<null>>(`${BASE}/logout`, data)
      .then((r) => r.data),
};
