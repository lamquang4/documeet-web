export type UserStatus = "ACTIVE" | "LOCKED" | "DISABLED";
export type UnitStatus = "ACTIVE" | "INACTIVE";
export type DeviceStatus = "ACTIVE" | "REVOKED" | "WIPED";
export type SameSitePolicy = "Strict" | "Lax" | "None";

// Request
export interface LoginRequest {
  governmentId: string;
  password: string;
  deviceIMEI: string;
  deviceName?: string;
  platform?: string;
  osVersion?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LogoutRequest {
  refreshToken: string;
  sessionId: string;
}

export interface VerifyOtpRequest {
  mfaToken: string;
  otp: string;
}

export interface SendOtpRequest {
  mfaToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface CreateUserRequest {
  unitId: string;
  roleId: string;
  governmentId: string; // cccd
  fullName: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  repasswordHash: string;
}

export interface UpdateUserRequest {
  unitId: string;
  roleId: string;
  governmentId: string; // cccd
  fullName: string;
  email: string;
  phoneNumber: string;
  status: UserStatus;
  passwordHash?: string;
}

export interface CreateRoleRequest {
  roleCode: string;
  roleName: string;
  description: string;
}

export interface UpdateRoleRequest {
  roleCode: string;
  roleName: string;
  description: string;
}

export interface CreateUnitRequest {
  unitCode: string;
  unitName: string;
  userIds?: string[];
}

export interface UpdatedUnitRequest {
  unitCode: string;
  unitName: string;
  status: UnitStatus;
  userIds?: string[];
}

export interface UpdateUnitStatusRequest {
  status: UnitStatus;
}

// Response
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ErrorResponse {
  status: number;
  error: string;
  errorCode: number;
  message: string;
  path: string;
  timestamp: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  sessionId: string;
  tokenType: string;
  requireMfa: boolean;
  mfaToken: string;
  user: {
    userId: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface AccountResponse {
  userId: string;
  unitName: string;
  governmentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

// người dùng
export interface UserResponse {
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
  status: UserStatus;
  failedLoginCount: number;
  lastLoginDate?: string;
  lockoutEndTime?: string;
  createdDate: string;
}

export interface UserProfileResponse {
  userId: string;
  unitName: string;
  governmentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  roleCode: string;
}

export interface SelectedUserForUnitResponse {
  userId: string;
  fullName: string;
  unitName?: string;
}

// chức vụ
export interface RoleResponse {
  roleId: string;
  roleCode: string;
  roleName: string;
  description?: string;
}

// đơn vị
export interface UnitResponse {
  unitId: string;
  unitCode: string;
  unitName: string;
  status: UnitStatus;
}

export interface UnitDetailResponse {
  unitId: string;
  unitCode: string;
  unitName: string;
  status: UnitStatus;
  users: {
    userId: string;
  }[];
}

export interface SelectedUnitForUserResponse {
  unitId: string;
  unitName: string;
}

// thiết bị đăng ký
export interface DeviceResponse {
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
  trusted: boolean;
  status: DeviceStatus;
  lastUsedDate: string;
  registeredDate: string;
}

// otp
export interface OtpResponse {
  email: string;
  message: string;
  expiresAt: string;
}

export interface OtpVerifiedResponse {
  isVerified: boolean;
}

// token
export interface AccessTokenPayload {
  sub: string; // governmentId
  sessionId: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string; // governmentId
  iat: number;
  exp: number;
}

export interface MfaTokenPayload {
  sub: string; // governmentId
  type: "MFA";
  userId: string;
  email: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  iat: number;
  exp: number;
}

export interface CookieOptions {
  expires?: number; // ngày
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: SameSitePolicy;
}

export interface DeviceData {
  deviceIMEI: string;
  deviceName: string;
  platform: string;
  osVersion: string;
  userAgent: string;
}
