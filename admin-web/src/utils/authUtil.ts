import { cookieUtil } from "./cookieUtil";

export const clearAuth = () => {
  cookieUtil.remove("accessToken");
  cookieUtil.remove("refreshToken");
  cookieUtil.remove("mfaToken");
  cookieUtil.remove("sessionId");
  localStorage.removeItem("user");
};