import { useRef } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { cookieUtil } from "../utils/cookieUtil";
import { clearAuthStorage } from "../utils/authUtil";
import type { AccessTokenPayload } from "../types/type";
import { useLogout } from "../hooks/queries/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const accessToken = cookieUtil.get("accessToken");
  const { mutate: logout } = useLogout();
  const hasLoggedOut = useRef(false);

  // Không có token
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  // Token không decode được
  let decoded: AccessTokenPayload;
  try {
    decoded = jwtDecode<AccessTokenPayload>(accessToken);
  } catch {
    clearAuthStorage();
    return <Navigate to="/" replace />;
  }

  // Token hết hạn
  if (decoded.exp * 1000 < Date.now()) {
    clearAuthStorage();
    return <Navigate to="/" replace />;
  }

  // Không có user hoặc không phải ADMIN
  let user: { role: string } | null = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!user || user.role !== "ADMIN") {
    clearAuthStorage();

    if (!hasLoggedOut.current) {
      hasLoggedOut.current = true;
      logout();
    }

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
