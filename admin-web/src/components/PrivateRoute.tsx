import { jwtDecode } from "jwt-decode";
import { cookieUtil } from "../utils/cookieUtil";
import { logoutAndRedirect } from "../utils/authUtil";
import type { AccessTokenPayload } from "../types/type";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const accessToken = cookieUtil.get("accessToken");
  const refreshToken = cookieUtil.get("refreshToken");

  // Không có token nào thì logout
  if (!accessToken && !refreshToken) {
    logoutAndRedirect();
    return <Navigate to="/" replace />;
  }

  // Có accessToken thì validate
  if (accessToken) {
    try {
      const decoded = jwtDecode<AccessTokenPayload>(accessToken);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired && !refreshToken) {
        // Hết hạn, không có refreshToken thì logout
        logoutAndRedirect();
        return <Navigate to="/" replace />;
      }
      // isExpired + còn refreshToken → cho vào, interceptor tự refresh khi gọi API
    } catch {
      // Token lỗi format
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
