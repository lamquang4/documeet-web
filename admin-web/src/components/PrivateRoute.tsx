import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { cookieUtil } from "../utils/cookieUtil";
import { clearAuthStorage } from "../utils/authUtil";
import type { AccessTokenPayload } from "../types/type";
import { useLogout } from "../hooks/queries/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function LogoutAndRedirect({ logout }: { logout: () => void }) {
  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/" replace />;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const accessToken = cookieUtil.get("accessToken");
  const { mutate: logout } = useLogout();

  // Không có token
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  let decoded: AccessTokenPayload;
  try {
    decoded = jwtDecode<AccessTokenPayload>(accessToken);
  } catch {
    clearAuthStorage();
    return <Navigate to="/" replace />;
  }

  // accessToken hết hạn
  if (decoded.exp * 1000 < Date.now()) {
    clearAuthStorage();
    return <Navigate to="/" replace />;
  }

  // khi không có user trong localStorage đăng xuất
  let user: { role: string } | null = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!user || user.role !== "ADMIN") {
    return <LogoutAndRedirect logout={logout} />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
