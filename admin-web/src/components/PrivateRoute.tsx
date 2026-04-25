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

  if (!accessToken && !refreshToken) {
    logoutAndRedirect();
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
