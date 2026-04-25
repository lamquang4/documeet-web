import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
import { useGetMe } from "../hooks/queries/useUsers";
import Overplay from "./ui/Overplay";
import Loading from "./ui/Loading";

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
  const navigate = useNavigate();

  const accessToken = cookieUtil.get("accessToken");
  const refreshToken = cookieUtil.get("refreshToken");
  const tokenStatus = getTokenStatus();

  const { data, isLoading, isError } = useGetMe();

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

  useEffect(() => {
    if (data?.data?.roleCode === "ADMIN") {
      navigate("/account/profile", { replace: true });
    }
  }, [data]);

  if (!accessToken && !refreshToken) {
    logoutAndRedirect();
    return <Navigate to="/" replace />;
  }

  if (isLoading)
    return (
      <Overplay>
        <Loading height={0} size={55} color="white" thickness={8} />
        <h4 className="text-white">Vui lòng chờ trong giây lát ...</h4>
      </Overplay>
    );

  if (isError || data?.data?.roleCode !== "ADMIN") {
    logoutAndRedirect();
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
