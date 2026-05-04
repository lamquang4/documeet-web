import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import type {
  ApiResponse,
  ErrorResponse,
  LoginResponse,
  OtpResponse,
  VerifyOtpRequest,
} from "../../types/type";
import { cookieUtil } from "../../utils/cookieUtil";
import { otpApi } from "../../apis/otpApi";
import { COOKIE_EXPIRES, COOKIE_OPTIONS } from "../../constant/cookie";
import { tokenUtil } from "../../utils/tokenUtil";

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

      tokenUtil.setTokenCookie("accessToken", res.data.accessToken);

      cookieUtil.set("sessionId", res.data.sessionId, {
        ...COOKIE_OPTIONS,
        expires: COOKIE_EXPIRES.session,
      });

      tokenUtil.setTokenCookie("refreshToken", res.data.refreshToken);

      cookieUtil.remove("mfaToken");

      queryClient.clear();

      window.location.href = "/account/profile";
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Xác thực OTP thất bại");
    },
  });
};

export const useResendOtp = (onSuccess?: () => void) => {
  return useMutation<ApiResponse<OtpResponse>, AxiosError<ErrorResponse>, void>(
    {
      mutationFn: () => {
        const mfaToken = cookieUtil.get("mfaToken");

        if (!mfaToken) {
          return Promise.reject(new Error("Phiên xác thực đã hết hạn"));
        }

        return otpApi.resendOtp({ mfaToken });
      },

      onSuccess: (res) => {
        toast.success(res.message);
        onSuccess?.();
      },

      onError: (error) => {
        toast.error(error.response?.data?.message ?? "Gửi lại OTP thất bại");
      },
    },
  );
};
