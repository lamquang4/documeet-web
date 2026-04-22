import type {
  ApiResponse,
  CreateUnitRequest,
  UpdatedUnitRequest,
  UnitResponse,
  UnitDetailResponse,
  SelectedUnitForUserResponse,
  PageResponse,
  UpdateUnitStatusRequest,
} from "../types/type";
import axiosInstance from "./axiosInstance";

export interface GetUnitsParams {
  page?: number;
  size?: number;
  keyword?: string;
}

export interface GetSelectedUnitForUserParams {
  page?: number;
  size?: number;
  keyword?: string;
}

const BASE = "/api/units";

export const unitApi = {
  // GET /units?page=0&size=10&keyword=
  getAll: (params?: GetUnitsParams) =>
    axiosInstance
      .get<ApiResponse<PageResponse<UnitResponse>>>(BASE, { params })
      .then((r) => r.data),

  // GET /units/selected-unit-for-user?page=0&size=10&keyword=
  getSelectedUnitForUser: (params?: GetSelectedUnitForUserParams) =>
    axiosInstance
      .get<
        ApiResponse<PageResponse<SelectedUnitForUserResponse>>
      >(`${BASE}/selected-unit-for-user`, { params })
      .then((r) => r.data),

  // GET /units/:id
  getById: (id: string) =>
    axiosInstance
      .get<ApiResponse<UnitDetailResponse>>(`${BASE}/${id}`)
      .then((r) => r.data),

  // POST /units
  create: (data: CreateUnitRequest) =>
    axiosInstance
      .post<ApiResponse<UnitResponse>>(BASE, data)
      .then((r) => r.data),

  // PUT /units/:id
  update: (id: string, data: UpdatedUnitRequest) =>
    axiosInstance
      .put<ApiResponse<UnitResponse>>(`${BASE}/${id}`, data)
      .then((r) => r.data),

  // PATCH /{unitId}/status
  updateStatus: (unitId: string, data: UpdateUnitStatusRequest) =>
    axiosInstance
      .patch<ApiResponse<UnitResponse>>(`${BASE}/${unitId}/status`, data)
      .then((r) => r.data),

  // DELETE /units/:id
  remove: (id: string) =>
    axiosInstance
      .delete<ApiResponse<null>>(`${BASE}/${id}`)
      .then((r) => r.data),
};
