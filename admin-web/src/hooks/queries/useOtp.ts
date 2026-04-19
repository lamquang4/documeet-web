import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import type {
  ApiResponse,
  ErrorResponse,
  LoginResponse,
  VerifyOtpRequest,
} from "../../types/type";
import { cookieUtil } from "../../utils/cookieUtil";
import { otpApi } from "../../apis/otpApi";

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<LoginResponse>,
    AxiosError<ErrorResponse>,
    VerifyOtpRequest
  >({
    mutationFn: (data) => otpApi.verifyOtp(data),

    onSuccess: (res) => {
      toast.success(res.message);

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

      cookieUtil.remove("mfaToken");

      queryClient.clear();

      window.location.href = "/account/profile";
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Xác thực OTP thất bại");
    },
  });
};
