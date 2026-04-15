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

export type CreateRoleRequest = {
  roleCode: string;
  roleName: string;
  description?: string;
};

export type UpdateRoleRequest = {
  roleCode: string;
  roleName: string;
  description?: string;
};

export type CreateUnitRequest = {
  unitCode: string;
  unitName: string;
  status: "ACTIVE" | "INACTIVE";
  userIds?: string[];
};

export type UpdatedUnitRequest = {
  unitCode: string;
  unitName: string;
  status: "ACTIVE" | "INACTIVE";
  userIds?: string[];
};

// Response
export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  sessionId: string;
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

// người dùng
export type UserResponse = {
  userId: string;
  unit?: {
    unitId: string;
    unitName: string;
  };
  role: {
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

export type UsersSelectResponse = {
  userId: string;
  fullName: string;
  unitName?: string;
};

// chức vụ
export type RoleResponse = {
  roleId: string;
  roleCode: string;
  roleName: string;
  description?: string;
};

// đơn vị
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

export type UnitsSelectResponse = {
  unitId: string;
  unitName: string;
};

// thiết bị đăng ký
export type DeviceResponse = {
  deviceId: string;
  user: {
    governmentId: string;
    phoneNumber: string;
    fullName: string;
  };
  deviceIMEI: string;
  deviceName: string;
  platform: string;
  osVersion: string;
  status: "ACTIVE" | "REVOKED" | "WIPED";
  lastUsedDate: string;
  registeredDate: string;
  isTrusted: boolean;
};
