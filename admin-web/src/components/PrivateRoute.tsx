import { jwtDecode } from "jwt-decode";
import { cookieUtil } from "../utils/cookieUtil";
import { logoutAndRedirect } from "../utils/authUtil";
import type { AccessTokenPayload } from "../types/type";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const accessToken = cookieUtil.get("accessToken");

  // Không có token
  if (!accessToken) {
    return null;
  }

  // Token không decode được
  let decoded: AccessTokenPayload;
  try {
    decoded = jwtDecode<AccessTokenPayload>(accessToken);
  } catch {
    logoutAndRedirect();
    return null;
  }

  // Token hết hạn
  if (decoded.exp * 1000 < Date.now()) {
    logoutAndRedirect();
    return null;
  }

  // Không có user hoặc không phải ADMIN
  let user: { role: string } | null = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!user || user.role !== "ADMIN") {
    logoutAndRedirect();
    return null;
  }

  return <>{children}</>;
}

export default PrivateRoute;
