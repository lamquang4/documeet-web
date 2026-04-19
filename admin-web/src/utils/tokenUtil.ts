import { jwtDecode } from "jwt-decode";
import { cookieUtil } from "./cookieUtil";
import type {
  AccessTokenPayload,
  MfaTokenPayload,
  RefreshTokenPayload,
} from "../types/type";

export const tokenUtil = {
  getAccessToken: () => {
    const token = cookieUtil.get("accessToken");
    if (!token) return null;
    return jwtDecode<AccessTokenPayload>(token);
  },

  getRefreshToken: () => {
    const token = cookieUtil.get("refreshToken");
    if (!token) return null;
    return jwtDecode<RefreshTokenPayload>(token);
  },

  getMfaToken: () => {
    const token = cookieUtil.get("mfaToken");
    if (!token) return null;
    return jwtDecode<MfaTokenPayload>(token);
  },
};
