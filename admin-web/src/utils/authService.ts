import { jwtDecode } from "jwt-decode";
import { authApi } from "../apis/authApi";
import { COOKIE_EXPIRES, COOKIE_OPTIONS } from "../constant/cookieConstant";
import type { AccessTokenPayload } from "../types/type";
import { cookieUtil } from "./cookieUtil";

let onLogout: () => void = () => {
  window.location.href = "/";
};

export const setLogoutCallback = (cb: () => void) => {
  onLogout = cb;
};

let beforeUnloadListenerAdded = false;

export const initBeforeUnloadLogout = () => {
  if (beforeUnloadListenerAdded) return;
  beforeUnloadListenerAdded = true;

  window.addEventListener("beforeunload", () => {
    const refreshToken = cookieUtil.get("refreshToken");
    const sessionId = cookieUtil.get("sessionId");

    if (!refreshToken || !sessionId) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken, sessionId }),
      keepalive: true,
    });

    clearAuthStorage();
    stopRefreshScheduler();
  });
};

export const saveTokens = (data: {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
  user?: { role: string };
}) => {
  cookieUtil.set("accessToken", data.accessToken, {
    ...COOKIE_OPTIONS,
    expires: data.expiresIn / 86400,
  });

  if (data.refreshToken) {
    cookieUtil.set("refreshToken", data.refreshToken, {
      ...COOKIE_OPTIONS,
      expires: COOKIE_EXPIRES.refresh,
    });
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
): boolean => {
  const remaining = getRemainingSeconds(token);
  console.log(
    `Token còn ${remaining.toFixed(0)}s, threshold ${thresholdSeconds}s, expiringSoon: ${remaining < thresholdSeconds}`,
  );
  return remaining < thresholdSeconds;
};

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const clearRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

export const doRefresh = async (): Promise<string | null> => {
  const refreshToken = cookieUtil.get("refreshToken");
  console.log(
    "doRefresh called, refreshToken:",
    refreshToken ? "có" : "KHÔNG CÓ",
  );

  if (!refreshToken) {
    console.error("Không có refreshToken → logout");
    await logoutAndRedirect();
    return null;
  }

  try {
    console.log("Gọi authApi.refresh...");
    const res = await authApi.refresh({ refreshToken });
    console.log("authApi.refresh thành công:", res);
    saveTokens(res.data);
    scheduleRefresh(res.data.expiresIn);
    return res.data.accessToken;
  } catch (err) {
    console.error("authApi.refresh thất bại:", err);
    await logoutAndRedirect();
    return null;
  }
};

export const scheduleRefresh = (expiresInSeconds: number) => {
  clearRefreshTimer();

  const delay = (expiresInSeconds - 60) * 1000;

  if (delay <= 0) {
    doRefresh();
    return;
  }

  refreshTimer = setTimeout(() => {
    doRefresh();
  }, delay);
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
  onLogout();
};
