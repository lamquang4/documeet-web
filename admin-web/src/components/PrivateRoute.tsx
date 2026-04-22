import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import type { AccessTokenPayload } from "../types/type";
import {
  doRefresh,
  getRemainingSeconds,
  initVisibilityRefresh,
  logoutAndRedirect,
  scheduleRefresh,
  startRefreshScheduler,
} from "../utils/authService";
import { cookieUtil } from "../utils/cookieUtil";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const checkRole = (): boolean => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return !!(user && user.role === "ADMIN");
  } catch {
    return false;
  }
};

const getTokenStatus = (): "valid" | "expired" | "missing" => {
  const accessToken = cookieUtil.get("accessToken");
  if (!accessToken) return "missing";
  try {
    const decoded = jwtDecode<AccessTokenPayload>(accessToken);
    return decoded.exp * 1000 < Date.now() ? "expired" : "valid";
  } catch {
    return "missing";
  }
};

function PrivateRoute({ children }: PrivateRouteProps) {
  const accessToken = cookieUtil.get("accessToken");
  const refreshToken = cookieUtil.get("refreshToken");
  const tokenStatus = getTokenStatus();

  if (!accessToken && !refreshToken) {
    logoutAndRedirect();
    return <Navigate to="/" replace />;
  }

  if (tokenStatus === "valid" && !checkRole()) {
    logoutAndRedirect();
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const init = async () => {
      if (tokenStatus === "valid") {
        const remaining = getRemainingSeconds(accessToken!);
        scheduleRefresh(remaining);
        initVisibilityRefresh();
        return;
      }

      if (refreshToken) {
        const newToken = await doRefresh();
        if (!newToken) return;

        startRefreshScheduler();
        initVisibilityRefresh();
      }
    };

    init();
  }, []);

  return <>{children}</>;
}

export default PrivateRoute;
