import type { DeviceResponse } from "../types/type";

export const mockDevices: DeviceResponse[] = [
  {
    deviceId: "dev-001",
    user: {
      governmentId: "012345678901",
      phoneNumber: "0901234567",
      fullName: "Nguyễn Văn A",
    },
    deviceIMEI: "IMEI-iphone-15-pro-001",
    deviceName: "iPhone 15 Pro",
    platform: "IOS",
    osVersion: "iOS 17.2",
    isTrusted: true,
    status: "ACTIVE",
    lastUsedDate: "2026-02-20T09:15:00Z",
    registeredDate: "2026-01-10T08:00:00Z",
  },
  {
    deviceId: "dev-002",
    user: {
      governmentId: "188222333444",
      phoneNumber: "0934567890",
      fullName: "Lâm Diệu Quang",
    },
    deviceIMEI: "IMEI-iphone-17-pro-001",
    deviceName: "iPhone 17 Pro",
    platform: "IOS",
    osVersion: "iOS 17.2",
    isTrusted: true,
    status: "REVOKED",
    lastUsedDate: "2026-02-18T14:30:00Z",
    registeredDate: "2026-01-05T10:00:00Z",
  },
  {
    deviceId: "dev-003",
    user: {
      governmentId: "188222333444",
      phoneNumber: "0934567890",
      fullName: "Lâm Diệu Quang",
    },
    deviceIMEI: "IMEI-iphone-17-pro-002",
    deviceName: "iPhone 17 Pro",
    platform: "IOS",
    osVersion: "iOS 17.2",
    isTrusted: false,
    status: "WIPED",
    lastUsedDate: "2026-02-18T14:30:00Z",
    registeredDate: "2026-01-05T10:00:00Z",
  },
];
