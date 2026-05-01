import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { AccessTokenPayload } from "../types/type";
import {
  doRefresh,
  getRemainingSeconds,
  initVisibilityRefresh,
  scheduleRefresh,
} from "../utils/authService";
import { cookieUtil } from "../utils/cookieUtil";

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

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const refreshToken = cookieUtil.get("refreshToken");
  const tokenStatus = getTokenStatus();

  const [authState, setAuthState] = useState<"loading" | "ok" | "fail">(
    tokenStatus === "valid" ? "ok" : "loading",
  );

  useEffect(() => {
    if (tokenStatus === "valid") {
      const accessToken = cookieUtil.get("accessToken")!;
      const remaining = getRemainingSeconds(accessToken);
      scheduleRefresh(remaining);
      initVisibilityRefresh();
      setAuthState("ok");
      return;
    }

    if (refreshToken) {
      doRefresh().then((newToken) => {
        if (newToken) {
          initVisibilityRefresh();
          setAuthState("ok");
        } else {
          setAuthState("fail");
        }
      });
      return;
    }

    setAuthState("fail");
  }, []);

  if (authState === "loading") return null;
  if (authState === "fail") return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default PrivateRoute;
