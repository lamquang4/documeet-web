export const COOKIE_OPTIONS = {
  secure: true,
  sameSite: "None" as const,
};

export const COOKIE_EXPIRES = {
  session: 7, // 7 ngày
  refresh: 7, // 7 ngày
  mfa: 5 / 1440, // 5 phút
} as const;
