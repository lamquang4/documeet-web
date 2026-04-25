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
import { userKeys } from "./useUsers";
import { userApi } from "../../apis/userApi";

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
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<LoginResponse>,
    AxiosError<ErrorResponse>,
    LoginRequest
  >({
    mutationFn: (data) => authApi.login(data),

    onSuccess: async (res) => {
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

      saveTokens(res.data);
      cookieUtil.set("sessionId", res.data.sessionId, {
        ...COOKIE_OPTIONS,
        expires: COOKIE_EXPIRES.session,
      });

      scheduleRefresh(res.data.expiresIn);
      initVisibilityRefresh();

      await queryClient.prefetchQuery({
        queryKey: [...userKeys.all, "me"],
        queryFn: () => userApi.getMe(),
      });

      onLoginSuccess();
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
      stopRefreshScheduler();
      queryClient.clear();
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
      saveTokens(res.data);
      scheduleRefresh(res.data.expiresIn);
      queryClient.invalidateQueries();
    },
  });
};
