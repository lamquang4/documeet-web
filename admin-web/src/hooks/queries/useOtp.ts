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
import { COOKIE_EXPIRES, COOKIE_OPTIONS } from "../../constant/cookieConstant";

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

      cookieUtil.set("accessToken", res.data.accessToken, {
        ...COOKIE_OPTIONS,
        expires: res.data.expiresIn / 86400,
      });

      cookieUtil.set("sessionId", res.data.sessionId, {
        ...COOKIE_OPTIONS,
        expires: COOKIE_EXPIRES.session,
      });

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
