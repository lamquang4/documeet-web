import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deviceApi, type GetDevicesParams } from "../../apis/deviceApi";
import type {
  ApiResponse,
  DeviceResponse,
  ErrorResponse,
  PageResponse,
} from "../../types/type";
import type { AxiosError } from "axios";

export const deviceKeys = {
  all: ["devices"] as const,

  lists: (params?: GetDevicesParams) =>
    [...deviceKeys.all, "list", params?.page, params?.size] as const,
};

export const useGetAllDevices = (params?: GetDevicesParams) => {
  return useQuery<
    ApiResponse<PageResponse<DeviceResponse>>,
    AxiosError<ErrorResponse>
  >({
    queryKey: deviceKeys.lists(params),
    queryFn: () => deviceApi.getAll(params),
    placeholderData: (prev) => prev,
  });
};

// Status của device

// REVOKE DEVICE
export const useRevokeDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<DeviceResponse>,
    AxiosError<ErrorResponse>,
    string
  >({
    mutationFn: (id) => deviceApi.revoke(id),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Thu hồi thiết bị thất bại");
    },
  });
};

// WIPE DEVICE
export const useWipeDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<DeviceResponse>,
    AxiosError<ErrorResponse>,
    string
  >({
    mutationFn: (id) => deviceApi.wipe(id),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Xóa từ xa thiết bị thất bại",
      );
    },
  });
};

// ACTIVATE DEVICE
export const useActivateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<DeviceResponse>,
    AxiosError<ErrorResponse>,
    string
  >({
    mutationFn: (id) => deviceApi.activate(id),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Kích hoạt thiết bị thất bại",
      );
    },
  });
};
