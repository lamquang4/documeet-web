import { Navigate } from "react-router-dom";
import { cookieUtil } from "../utils/cookieUtil";
import { clearAuth } from "../utils/authUtil";
import type { AccessTokenPayload } from "../types/type";
import { jwtDecode } from "jwt-decode";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const accessToken = cookieUtil.get("accessToken");

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  const decoded = jwtDecode<AccessTokenPayload>(accessToken);
  if (decoded.exp * 1000 < Date.now()) {
    clearAuth();
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || user.role !== "ADMIN") {
      clearAuth();
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch {
    clearAuth();
    return <Navigate to="/" replace />;
  }
}

export default PrivateRoute;
