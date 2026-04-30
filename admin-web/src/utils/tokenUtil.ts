import { jwtDecode } from "jwt-decode";
import { cookieUtil } from "./cookieUtil";
import { COOKIE_OPTIONS } from "../constant/cookie";
import type {
  AccessTokenPayload,
  MfaTokenPayload,
  RefreshTokenPayload,
} from "../types/type";

export const tokenUtil = {
  getAccessToken: (): AccessTokenPayload | null => {
    const token = cookieUtil.get("accessToken");
    if (!token) return null;
    try {
      return jwtDecode<AccessTokenPayload>(token);
    } catch {
      return null;
    }
  },

  getRefreshToken: (): RefreshTokenPayload | null => {
    const token = cookieUtil.get("refreshToken");
    if (!token) return null;
    try {
      return jwtDecode<RefreshTokenPayload>(token);
    } catch {
      return null;
    }
  },

  getMfaToken: (): MfaTokenPayload | null => {
    const token = cookieUtil.get("mfaToken");
    if (!token) return null;
    try {
      return jwtDecode<MfaTokenPayload>(token);
    } catch {
      return null;
    }
  },

  // set cookie lấy exp từ chính token
  setTokenCookie: (name: string, rawToken: string): void => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(rawToken);
      const expiresInDays = (exp - Date.now() / 1000) / 86400;
      cookieUtil.set(name, rawToken, {
        ...COOKIE_OPTIONS,
        expires: expiresInDays,
      });
    } catch {
      cookieUtil.set(name, rawToken, COOKIE_OPTIONS);
    }
  },
};
