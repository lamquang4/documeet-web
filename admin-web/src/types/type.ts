// Request
export type LoginRequest = {
  governmentId: string; // cccd
  password: string;
};

export type UpdateUserRequest = {
  unitId: string;
  roleId: string;
  governmentId: string; // cccd
  fullName: string;
  email: string;
  phoneNumber: string;
  status: "ACTIVE" | "LOCKED" | "DISABLED";
};

export type AddRoleRequest = {
  roleCode: string;
  roleName: string;
  description?: string;
};

export type UpdateRoleRequest = {
  roleCode: string;
  roleName: string;
  description?: string;
};

export type AddUnitRequest = {
  unitCode: string;
  unitName: string;
  status: "ACTIVE" | "INACTIVE";
};

export type UpdatedUnitRequest = {
  unitCode: string;
  unitName: string;
  status: "ACTIVE" | "INACTIVE";
};

// Response
export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  sessionId: string; // UserLoginSessions
  isTrustedDevice: boolean;
  user: {
    userId: string;
    fullName: string;
    role: string;
  };
};

export type AccountResponse = {
  userId: string;
  unitName: string;
  governmentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: "ACTIVE" | "LOCKED" | "DISABLED";
};

export type UserResponse = {
  userId: string;
  unit?: {
    unitId: string;
    unitName: string;
  };
  role?: {
    roleId: string;
    roleName: string;
  };
  governmentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: "ACTIVE" | "LOCKED" | "DISABLED";
  failedLoginCount: number;
  lastLoginDate?: string;
  lockoutEndTime?: string;
  createdDate: string;
};

export type RoleResponse = {
  roleId: string;
  roleCode: string;
  roleName: string;
  description?: string;
};

export type UnitResponse = {
  unitId: string;
  unitCode: string;
  unitName: string;
  status: "ACTIVE" | "INACTIVE";
};

export type UnitDetailResponse = {
  unitId: string;
  unitCode: string;
  unitName: string;
  status: "ACTIVE" | "INACTIVE";
  userIds: string[];
};

export type DeviceResponse = {
  deviceId: string;
  user: {
    governmentId: string;
    phoneNumber: string;
    fullName: string;
  };
  deviceUUID: string;
  deviceName: string;
  platform: string;
  osVersion: string;
  isTrusted: boolean;
  status: "ACTIVE" | "REVOKED" | "WIPED";
  lastUsedDate: string;
  registeredDate: string;
  // userLoginSession
  isOnline: boolean;
  lastActiveAt?: string; // từ session gần nhất
  lastIpAddress?: string; // từ session gần nhất
};

export type DeviceSummaryResponse = {
  totalDevices: number; // Tất cả thiết bị
  onlineDevices: number; // Thiết bị online
  unverifiedDevices: number; // Chưa xác thực
  trustedDevices: number; // Tin cậy
};

export type LogResponse = {
  logId: string;
  user?: {
    governmentId: string;
    fullName: string;
    unitName: string;
  };
  device?: {
    deviceUUID: string;
    deviceName: string;
    isTrusted: boolean;
  };
  ipAddress?: string;
  userAgent?: string;
  module: string; // AUTH, DOCUMENT, MEETING, VOTE, SYSTEM
  actionType: string;
  status: "SUCCESS" | "FAILED";
  description: string;
  createdDate: string;
};

export type RoleFilterResponse = {
  roleCode: string;
  roleName: string;
};

export type UnitsSelectResponse = {
  unitId: string;
  unitName: string;
};

export type RolesSelectResponse = {
  roleId: string;
  roleName: string;
};

export type UsersSelectResponse = {
  userId: string;
  fullName: string;
  unitName?: string;
};
