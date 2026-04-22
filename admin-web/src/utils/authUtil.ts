import { authApi } from "../apis/authApi";
import { cookieUtil } from "./cookieUtil";

export const clearAuthStorage = () => {
  cookieUtil.remove("accessToken");
  cookieUtil.remove("refreshToken");
  cookieUtil.remove("mfaToken");
  cookieUtil.remove("sessionId");
  localStorage.removeItem("user");
  window.location.href = "/";
};

export const logoutAndRedirect = async () => {
  const refreshToken = cookieUtil.get("refreshToken");
  const sessionId = cookieUtil.get("sessionId");

  if (refreshToken && sessionId) {
    try {
      await authApi.logout({ refreshToken, sessionId });
    } catch {}
  }

  clearAuthStorage();
};
