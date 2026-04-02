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

export const DEVICE_STATUS_OPTIONS = [
  COMMON_ALL_OPTION,
  { name: "Hoạt động", value: "ACTIVE" },
  { name: "Thu hồi", value: "REVOKED" },
  { name: "Xóa từ xa", value: "WIPED" },
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
