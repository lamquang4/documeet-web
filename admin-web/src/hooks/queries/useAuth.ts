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
import { clearAuth } from "../../utils/authUtil";

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

    onSuccess: (res) => {
      if (res.data?.requireMfa) {
        if (res.data?.mfaToken) {
          cookieUtil.set("mfaToken", res.data.mfaToken, {
            expires: 5 / (24 * 60),
            secure: true,
            sameSite: "Strict",
          });
        }
        onRequireMfa();
        return;
      } else {
        toast.success(res.message);
      }

      if (res.data?.accessToken) {
        cookieUtil.set("accessToken", res.data.accessToken, {
          expires: res.data.expiresIn / 86400,
          secure: true,
          sameSite: "Strict",
        });
      }

      if (res.data?.refreshToken) {
        cookieUtil.set("refreshToken", res.data.refreshToken, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      }

      if (res.data?.sessionId) {
        cookieUtil.set("sessionId", res.data.sessionId, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      }

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
      clearAuth();
      queryClient.clear();
      window.location.href = "/";
    },

    onError: () => {
      clearAuth();
      queryClient.clear();
      window.location.href = "/";
    },
  });
};
