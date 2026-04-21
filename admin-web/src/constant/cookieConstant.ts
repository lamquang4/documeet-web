export const COOKIE_OPTIONS = {
  secure: true,
  sameSite: "None" as const,
};

export const COOKIE_EXPIRES = {
  session: 7, // 7 ngày
  mfa: 5 / (24 * 60), // 5 phút
} as const;
