import type { ApiResponse, DeviceResponse, PageResponse } from "../types/type";
import axiosInstance from "./axiosInstance";

export interface GetDevicesParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
  isTrusted?: boolean;
}

const BASE = "/api/devices";

export const deviceApi = {
  // GET /devices?page=0&size=10
  getAll: (params?: GetDevicesParams) =>
    axiosInstance
      .get<ApiResponse<PageResponse<DeviceResponse>>>(BASE, { params })
      .then((r) => r.data),

  // POST /devices/:id/revoke
  revoke: (id: string) =>
    axiosInstance
      .post<ApiResponse<DeviceResponse>>(`${BASE}/${id}/revoke`)
      .then((r) => r.data),

  // POST /devices/:id/wipe
  wipe: (id: string) =>
    axiosInstance
      .post<ApiResponse<DeviceResponse>>(`${BASE}/${id}/wipe`)
      .then((r) => r.data),

  // POST /devices/:id/activate
  activate: (id: string) =>
    axiosInstance
      .post<ApiResponse<DeviceResponse>>(`${BASE}/${id}/activate`)
      .then((r) => r.data),
};
