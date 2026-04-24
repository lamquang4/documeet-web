import type {
  ApiResponse,
  CreateUserRequest,
  PageResponse,
  UpdateUserRequest,
  UserResponse,
  SelectedUserForUnitResponse,
  UserProfileResponse,
} from "../types/type";
import axiosInstance from "./axiosInstance";

export interface GetUsersParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
  role?: string;
}

export interface GetSelectedUserForUnitParams {
  page?: number;
  size?: number;
  keyword?: string;
}

const BASE = "/api/users";

export const userApi = {
  // GET /users?page=0&size=10&status=&role=&keyword=
  getAll: (params?: GetUsersParams) =>
    axiosInstance
      .get<ApiResponse<PageResponse<UserResponse>>>(BASE, { params })
      .then((r) => r.data),

  // GET /users/selected-user-for-unit?page=0&size=10&keyword=
  getSelectedUserForUnit: (params?: GetSelectedUserForUnitParams) =>
    axiosInstance
      .get<
        ApiResponse<PageResponse<SelectedUserForUnitResponse>>
      >(`${BASE}/selected-user-for-unit`, { params })
      .then((r) => r.data),

  // GET /users/:id
  getById: (id: string) =>
    axiosInstance
      .get<ApiResponse<UserResponse>>(`${BASE}/${id}`)
      .then((r) => r.data),

  // POST /users
  create: (data: CreateUserRequest) =>
    axiosInstance
      .post<ApiResponse<UserResponse>>(BASE, data)
      .then((r) => r.data),

  // PUT /users/:id
  update: (id: string, data: UpdateUserRequest) =>
    axiosInstance
      .put<ApiResponse<UserResponse>>(`${BASE}/${id}`, data)
      .then((r) => r.data),

  // DELETE /users/:id
  remove: (id: string) =>
    axiosInstance
      .delete<ApiResponse<null>>(`${BASE}/${id}`)
      .then((r) => r.data),

  // POST /users/:id/lock
  lock: (id: string) =>
    axiosInstance
      .post<ApiResponse<null>>(`${BASE}/${id}/lock`)
      .then((r) => r.data),

  // POST /users/:id/unlock
  unlock: (id: string) =>
    axiosInstance
      .post<ApiResponse<null>>(`${BASE}/${id}/unlock`)
      .then((r) => r.data),

  // POST /users/:id/activate
  activate: (id: string) =>
    axiosInstance
      .post<ApiResponse<null>>(`${BASE}/${id}/activate`)
      .then((r) => r.data),

  //GET /users/me
  getMe: () =>
    axiosInstance
      .get<ApiResponse<UserProfileResponse>>("/api/auth/me")
      .then((r) => r.data),
};
