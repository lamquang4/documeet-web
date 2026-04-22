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
import { clearAuthStorage } from "../../utils/authUtil";
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

      // set token vào cookie
      cookieUtil.set("accessToken", res.data.accessToken, {
        ...COOKIE_OPTIONS,
        expires: res.data.expiresIn / 86400,
      });

      cookieUtil.set("sessionId", res.data.sessionId, {
        ...COOKIE_OPTIONS,
        expires: COOKIE_EXPIRES.session,
      });

      cookieUtil.set("refreshToken", res.data.refreshToken, {
        ...COOKIE_OPTIONS,
        expires: COOKIE_EXPIRES.refresh,
      });

      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

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

      return authApi.logout({ refreshToken, sessionId });
    },

    onSuccess: () => {
      queryClient.invalidateQueries();
      clearAuthStorage();
    },

    onError: () => {
      queryClient.invalidateQueries();
      clearAuthStorage();
    },
  });
};

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

      queryClient.invalidateQueries();
    },
  });
};
