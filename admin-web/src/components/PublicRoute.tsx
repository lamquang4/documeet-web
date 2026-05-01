import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { cookieUtil } from "../utils/cookieUtil";
import { doRefresh, initVisibilityRefresh } from "../utils/authService";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const accessToken = cookieUtil.get("accessToken");
  const refreshToken = cookieUtil.get("refreshToken");

  const [authState, setAuthState] = useState<"loading" | "ok" | "redirect">(
    accessToken ? "redirect" : refreshToken ? "loading" : "ok",
  );

  useEffect(() => {
    if (authState !== "loading") return;

    doRefresh().then((newToken) => {
      if (newToken) {
        initVisibilityRefresh();
        setAuthState("redirect"); 
      } else {
        setAuthState("ok");
      }
    });
  }, []);

  if (authState === "loading") return null;
  if (authState === "redirect")
    return <Navigate to="/account/profile" replace />;
  return <>{children}</>;
}

export default PublicRoute;
