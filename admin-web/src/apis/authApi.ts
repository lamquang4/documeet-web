import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
} from "../types/type";
import { axiosPublic } from "./axiosInstance";

const BASE = "/api/auth";

export const authApi = {
  login: (data: LoginRequest) =>
    axiosPublic
      .post<ApiResponse<LoginResponse>>(`${BASE}/login`, data)
      .then((r) => r.data),

  logout: (data: LogoutRequest) =>
    axiosPublic
      .post<ApiResponse<null>>(`${BASE}/logout`, data)
      .then((r) => r.data),

  refresh: (data: RefreshTokenRequest) => {
    console.log("authApi.refresh gọi tới backend...");
    return axiosPublic
      .post<ApiResponse<LoginResponse>>(`${BASE}/refresh`, data)
      .then((r) => r.data);
  },
};
