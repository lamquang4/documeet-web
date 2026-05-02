import { jwtDecode } from "jwt-decode";
import { authApi } from "../apis/authApi";
import type { AccessTokenPayload } from "../types/type";
import { cookieUtil } from "./cookieUtil";
import { tokenUtil } from "./tokenUtil";

export const saveTokens = (data: {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
  user?: { role: string };
}) => {
  tokenUtil.setTokenCookie("accessToken", data.accessToken);
  if (data.refreshToken) {
    tokenUtil.setTokenCookie("refreshToken", data.refreshToken);
  }
};

export const clearAuthStorage = () => {
  cookieUtil.remove("accessToken");
  cookieUtil.remove("refreshToken");
  cookieUtil.remove("mfaToken");
  cookieUtil.remove("sessionId");
};

export const getRemainingSeconds = (token: string): number => {
  try {
    const decoded = jwtDecode<AccessTokenPayload>(token);
    return decoded.exp - Date.now() / 1000;
  } catch {
    return 0;
  }
};

export const isTokenExpiringSoon = (
  token: string,
  thresholdSeconds = 60,
): boolean => getRemainingSeconds(token) < thresholdSeconds;

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const clearRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const doRefresh = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) return refreshPromise;

  const refreshToken = cookieUtil.get("refreshToken");
  if (!refreshToken) {
    clearAuthStorage();
    window.location.href = "/";
    return null;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await authApi.refresh({ refreshToken });
      saveTokens(res.data);
      scheduleRefresh(res.data.expiresIn);
      return res.data.accessToken;
    } catch {
      await logoutAndRedirect();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const scheduleRefresh = (expiresInSeconds: number) => {
  clearRefreshTimer();
  const delay = (expiresInSeconds - 60) * 1000;
  const safeDelay = Math.max(delay, 5000);
  refreshTimer = setTimeout(() => {
    doRefresh();
  }, safeDelay);
};

export const startRefreshScheduler = () => {
  const accessToken = cookieUtil.get("accessToken");
  if (!accessToken) return;
  const remaining = getRemainingSeconds(accessToken);
  if (remaining <= 0) return;
  scheduleRefresh(remaining);
};

export const stopRefreshScheduler = () => {
  clearRefreshTimer();
};

let visibilityListenerAdded = false;

export const initVisibilityRefresh = () => {
  if (visibilityListenerAdded) return;
  visibilityListenerAdded = true;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;

    const accessToken = cookieUtil.get("accessToken");
    const refreshToken = cookieUtil.get("refreshToken");
    if (!refreshToken) return;

    if (!accessToken) {
      doRefresh();
      return;
    }

    const remaining = getRemainingSeconds(accessToken);
    if (remaining < 60) {
      doRefresh();
    } else {
      scheduleRefresh(remaining);
    }
  });
};

export const logoutAndRedirect = async () => {
  stopRefreshScheduler();

  const refreshToken = cookieUtil.get("refreshToken");
  const sessionId = cookieUtil.get("sessionId");

  if (refreshToken && sessionId) {
    try {
      await authApi.logout({ refreshToken, sessionId });
    } catch {}
  }

  clearAuthStorage();
  window.location.href = "/";
};
