import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import type {
  ApiResponse,
  ErrorResponse,
  LoginRequest,
  LoginResponse,
} from "../../types/type";
import { authApi } from "../../apis/authApi";
import { cookieUtil } from "../../utils/cookieUtil";
import {
  clearAuthStorage,
  initVisibilityRefresh,
  saveTokens,
  scheduleRefresh,
  stopRefreshScheduler,
} from "../../utils/authService";
import { COOKIE_EXPIRES, COOKIE_OPTIONS } from "../../constant/cookieConstant";

export const authKeys = {
  all: ["auth"] as const,
};

export const useLogin = ({ onRequireMfa }: { onRequireMfa: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<LoginResponse>,
    AxiosError<ErrorResponse>,
    LoginRequest
  >({
    mutationFn: (data) => authApi.login(data),

    onSuccess: async (res) => {
      // Yêu cầu MFA → lưu mfaToken rồi chuyển sang bước OTP
      if (res.data?.requireMfa) {
        if (res.data?.mfaToken) {
          cookieUtil.set("mfaToken", res.data.mfaToken, {
            ...COOKIE_OPTIONS,
            expires: COOKIE_EXPIRES.mfa,
          });
        }
        onRequireMfa();
        return;
      }

      // Không phải ADMIN → revoke token ngay, không lưu gì
      if (res.data?.user?.role !== "ADMIN") {
        toast.error("Bạn không có quyền truy cập hệ thống này");

        if (res.data?.refreshToken && res.data?.sessionId) {
          await authApi
            .logout({
              refreshToken: res.data.refreshToken,
              sessionId: res.data.sessionId,
            })
            .catch(() => {});
        }
        return;
      }

      toast.success(res.message);

      // Lưu token + user
      saveTokens(res.data);
      cookieUtil.set("sessionId", res.data.sessionId, {
        ...COOKIE_OPTIONS,
        expires: COOKIE_EXPIRES.session,
      });

      // Khởi động silent refresh timer ngay sau login
      scheduleRefresh(res.data.expiresIn);
      initVisibilityRefresh();

      queryClient.clear();
      window.location.href = "/account/profile";
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Đăng nhập thất bại");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, void>({
    mutationFn: () => {
      const refreshToken = cookieUtil.get("refreshToken") ?? "";
      const sessionId = cookieUtil.get("sessionId") ?? "";

      if (!refreshToken || !sessionId) {
        clearAuthStorage();
        return Promise.resolve({} as ApiResponse<null>);
      }

      return authApi.logout({ refreshToken, sessionId });
    },

    onSettled: () => {
      // Dừng timer khi logout
      stopRefreshScheduler();
      queryClient.clear();
      clearAuthStorage();
    },
  });
};

// useRefresh vẫn giữ để dùng thủ công nếu cần
export const useRefresh = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<LoginResponse>,
    AxiosError<ErrorResponse>,
    void
  >({
    mutationFn: () => {
      const refreshToken = cookieUtil.get("refreshToken") ?? "";
      return authApi.refresh({ refreshToken });
    },

    onSuccess: (res) => {
      saveTokens(res.data);
      // Reset timer sau khi refresh thủ công
      scheduleRefresh(res.data.expiresIn);
      queryClient.invalidateQueries();
    },
  });
};
