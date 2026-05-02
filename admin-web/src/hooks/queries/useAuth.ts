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
import { COOKIE_EXPIRES, COOKIE_OPTIONS } from "../../constant/cookie";
import { tokenUtil } from "../../utils/tokenUtil";
import { useNavigate } from "react-router-dom";

export const authKeys = {
  all: ["auth"] as const,
};

export const useLogin = ({
  onRequireMfa,
  onSuccess: onLoginSuccess,
}: {
  onRequireMfa: () => void;
  onSuccess: () => void;
}) => {
  return useMutation<
    ApiResponse<LoginResponse>,
    AxiosError<ErrorResponse>,
    LoginRequest
  >({
    mutationFn: (data) => authApi.login(data),

    onSuccess: async (res) => {
      if (res.data?.user?.role !== "ADMIN") {
        toast.error("Bạn không có quyền truy cập hệ thống này");
        return;
      }

      if (res.data?.requireMfa) {
        if (res.data?.mfaToken) {
          tokenUtil.setTokenCookie("mfaToken", res.data.mfaToken);
        }
        onRequireMfa();
        return;
      }

      toast.success(res.message);

      saveTokens(res.data);

      cookieUtil.set("sessionId", res.data.sessionId, {
        ...COOKIE_OPTIONS,
        expires: COOKIE_EXPIRES.session,
      });

      scheduleRefresh(res.data.expiresIn);
      initVisibilityRefresh();
      onLoginSuccess();
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Đăng nhập thất bại");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

    onSuccess: () => {
      stopRefreshScheduler();
      queryClient.clear();
      clearAuthStorage();
      navigate("/");
    },

    onError: () => {
      toast.error("Đăng xuất thất bại, vui lòng thử lại");
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
      saveTokens(res.data);
      scheduleRefresh(res.data.expiresIn);
      queryClient.invalidateQueries();
    },
  });
};
