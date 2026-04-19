import type {
  ApiResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleResponse,
  PageResponse,
} from "../types/type";
import axiosInstance from "./axiosInstance";

export interface GetRolesParams {
  page?: number;
  size?: number;
  keyword?: string;
}

const BASE = "/api/roles";

export const roleApi = {
  // GET /roles?page=0&size=10
  getAll: (params?: GetRolesParams) =>
    axiosInstance
      .get<ApiResponse<PageResponse<RoleResponse>>>(BASE, { params })
      .then((r) => r.data),

  // GET /roles/:id
  getById: (id: string) =>
    axiosInstance
      .get<ApiResponse<RoleResponse>>(`${BASE}/${id}`)
      .then((r) => r.data),

  // POST /roles
  create: (data: CreateRoleRequest) =>
    axiosInstance
      .post<ApiResponse<RoleResponse>>(BASE, data)
      .then((r) => r.data),

  // PUT /roles/:id
  update: (id: string, data: UpdateRoleRequest) =>
    axiosInstance
      .put<ApiResponse<RoleResponse>>(`${BASE}/${id}`, data)
      .then((r) => r.data),

  // DELETE /roles/:id
  remove: (id: string) =>
    axiosInstance
      .delete<ApiResponse<null>>(`${BASE}/${id}`)
      .then((r) => r.data),
};
