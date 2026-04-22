import { jwtDecode } from "jwt-decode";
import { cookieUtil } from "../utils/cookieUtil";
import { logoutAndRedirect } from "../utils/authUtil";
import type { AccessTokenPayload } from "../types/type";
import { Navigate } from "react-router-dom"; // Dùng Navigate thay vì return null

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const accessToken = cookieUtil.get("accessToken");
  const refreshToken = cookieUtil.get("refreshToken");

  if (!accessToken && !refreshToken) {
    return <Navigate to="/" replace />;
  }

  if (accessToken) {
    try {
      jwtDecode<AccessTokenPayload>(accessToken);
    } catch {
      logoutAndRedirect();
      return <Navigate to="/" replace />;
    }
  }

  let user: { role: string } | null = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!user || user.role !== "ADMIN") {
    logoutAndRedirect();
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
