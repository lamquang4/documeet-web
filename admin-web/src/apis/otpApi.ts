import type {
  ApiResponse,
  LoginResponse,
  VerifyOtpRequest,
} from "../types/type";
import axiosInstance from "./axiosInstance";

const BASE = "/api/mfa/otp";

export const otpApi = {
  verifyOtp: (data: VerifyOtpRequest) =>
    axiosInstance
      .post<ApiResponse<LoginResponse>>(`${BASE}/verify`, data)
      .then((r) => r.data),
};
