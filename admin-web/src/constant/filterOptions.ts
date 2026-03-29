export const COMMON_ALL_OPTION = {
  name: "Tất cả",
  value: null,
};

export const UNIT_STATUS_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Hoạt động", value: "ACTIVE" },
  { name: "Không hoạt động", value: "INACTIVE" },
];

export const USER_STATUS_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Hoạt động", value: "ACTIVE" },
  { name: "Bị khóa", value: "LOCKED" },
  { name: "Vô hiệu hóa", value: "DISABLED" },
];

export const LOG_STATUS_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Thành công", value: "SUCCESS" },
  { name: "Thất bại", value: "FAILED" },
];

export const DEVICE_STATUS_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Hoạt động", value: "ACTIVE" },
  { name: "Đã thu hồi", value: "REVOKED" },
  { name: "Đã xóa toàn bộ", value: "WIPED" },
];

export const DEVICE_TRUSTED_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Tin cậy", value: "true" },
  { name: "Chưa xác thực", value: "false" },
];

export const DEVICE_ONLINE_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Online", value: "true" },
  { name: "Offline", value: "false" },
];
