// Request
export interface LoginRequest {
  governmentId: string; // cccd
  password: string;
  deviceIMEI: string;
}

export interface LogoutRequest {
  refreshToken: string;
  sessionId: string;
}

export interface VerifyOtpRequest {
  mfaToken: string;
  otp: string;
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
  status: "ACTIVE" | "LOCKED" | "DISABLED";
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
  status: "ACTIVE" | "INACTIVE";
  userIds?: string[];
}

export interface UpdateUnitStatusRequest {
  status: string;
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
  status: "ACTIVE" | "LOCKED" | "DISABLED";
  failedLoginCount: number;
  lastLoginDate?: string;
  lockoutEndTime?: string;
  createdDate: string;
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
  status: "ACTIVE" | "INACTIVE";
}

export interface UnitDetailResponse {
  unitId: string;
  unitCode: string;
  unitName: string;
  status: "ACTIVE" | "INACTIVE";
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
  status: "ACTIVE" | "REVOKED" | "WIPED";
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
  iat: number; // issued at (epoch seconds)
  exp: number; // expiration (epoch seconds)
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
  sameSite?: "Strict" | "Lax" | "None";
}
