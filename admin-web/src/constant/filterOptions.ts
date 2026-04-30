export const COMMON_ALL_OPTION = {
  name: "Tất cả",
  value: null,
} as const;

export const UNIT_STATUS_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Hoạt động", value: "ACTIVE" },
  { name: "Không hoạt động", value: "INACTIVE" },
] as const;

export const USER_STATUS_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Hoạt động", value: "ACTIVE" },
  { name: "Bị khóa", value: "LOCKED" },
  { name: "Vô hiệu hóa", value: "DISABLED" },
] as const;

export const DEVICE_STATUS_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Hoạt động", value: "ACTIVE" },
  { name: "Thu hồi", value: "REVOKED" },
  { name: "Xóa từ xa", value: "WIPED" },
] as const;

export const DEVICE_TRUSTED_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Tin cậy", value: "true" },
  { name: "Chưa xác thực", value: "false" },
] as const;

// de lai cho tuong lai
export const DEVICE_ONLINE_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Online", value: "true" },
  { name: "Offline", value: "false" },
] as const;
