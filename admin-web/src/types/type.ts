// Request
export type UpdateUserRequest = {
  unitId: string;
  roleId: string;
  governmentId: string; // cccd
  fullName: string;
  email: string;
  phoneNumber: string;
  status?: "ACTIVE" | "LOCKED" | "DISABLED";
};

export type AddRoleRequest = {
  roleCode: string;
  roleName: string;
  maxSecurityLevel: number;
  description?: string;
};

export type UpdateRoleRequest = {
  roleCode: string;
  roleName: string;
  maxSecurityLevel: number;
  description?: string;
};

export type AddUnitRequest = {
  parentId?: string;
  unitCode: string;
  unitName: string;
  level: number;
  status: "ACTIVE" | "INACTIVE";
};

export type UpdatedUnitRequest = {
  parentId?: string;
  unitCode: string;
  unitName: string;
  level: number;
  status: "ACTIVE" | "INACTIVE";
};

// Response
export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  sessionId: string; // UserLoginSessions
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
  fullName?: string;
  email?: string;
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
  maxSecurityLevel: number;
  description?: string;
};

export type UnitResponse = {
  unitId: string;
  parent?: {
    parentId: string;
    parentName: string;
  };
  unitCode: string;
  unitName: string;
  level: number;
  status: "ACTIVE" | "INACTIVE";
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

export type AuditLogResponse = {
  logId: string;
  user?: {
    governmentId: string;
    fullName: string;
    unitName: string;
  };
  device: {
    deviceUUID: string;
    deviceName: string;
    platform: string;
    osVersion: string;
    isTrusted: boolean;
  };
  ipAddress: string;
  userAgent: string;
  module: string;
  actionType: string;
  description?: string;
  status: "SUCCESS" | "FAILED" | "WARNING";
  createdDate: string;
};
