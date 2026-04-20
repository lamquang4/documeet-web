import { Navigate } from "react-router-dom";
import { cookieUtil } from "../utils/cookieUtil";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const accessToken = cookieUtil.get("accessToken");

  // Đã đăng nhập có accessToken
  if (accessToken) {
    return <Navigate to="/account/profile" replace />;
  }

  return <>{children}</>;
}
export default PublicRoute;
