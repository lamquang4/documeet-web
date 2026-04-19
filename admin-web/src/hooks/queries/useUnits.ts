import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { unitApi, type GetUnitsParams } from "../../apis/unitApi";
import type {
  ApiResponse,
  CreateUnitRequest,
  ErrorResponse,
  PageResponse,
  UnitResponse,
  UnitDetailResponse,
  SelectedUnitForUserResponse,
  UpdatedUnitRequest,
  UpdateUnitStatusRequest,
} from "../../types/type";
import type { AxiosError } from "axios";

export const unitKeys = {
  all: ["units"] as const,

  lists: (params?: GetUnitsParams) =>
    [
      ...unitKeys.all,
      "list",
      params?.page,
      params?.size,
      params?.keyword,
    ] as const,

  detail: (id: string) => [...unitKeys.all, "detail", id] as const,

  selectedForUser: (params?: GetUnitsParams) =>
    [
      ...unitKeys.all,
      "selected-for-user",
      params?.page,
      params?.size,
      params?.keyword,
    ] as const,
};

export const useGetAllUnits = (params?: GetUnitsParams) => {
  return useQuery<
    ApiResponse<PageResponse<UnitResponse>>,
    AxiosError<ErrorResponse>
  >({
    queryKey: unitKeys.lists(params),
    queryFn: () => unitApi.getAll(params),
    placeholderData: (prev) => prev,
  });
};

export const useGetUnitById = (id: string) => {
  return useQuery<ApiResponse<UnitDetailResponse>, AxiosError<ErrorResponse>>({
    queryKey: unitKeys.detail(id),
    queryFn: () => unitApi.getById(id),
    enabled: !!id,
  });
};

export const useGetSelectedUnitForUser = (keyword: string) => {
  return useInfiniteQuery<
    ApiResponse<PageResponse<SelectedUnitForUserResponse>>,
    Error,
    SelectedUnitForUserResponse[],
    string[],
    number
  >({
    queryKey: ["units-select", keyword],

    queryFn: ({ pageParam = 0 }) =>
      unitApi.getSelectedUnitForUser({
        page: pageParam,
        size: 10,
        keyword,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data;

      return page < totalPages - 1 ? page + 1 : undefined;
    },

    select: (data) => data.pages.flatMap((p) => p.data.content),
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UnitResponse>,
    AxiosError<ErrorResponse>,
    CreateUnitRequest
  >({
    mutationFn: (data) => unitApi.create(data),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all });
      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Tạo đơn vị thất bại");
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UnitResponse>,
    AxiosError<ErrorResponse>,
    { id: string; data: UpdatedUnitRequest }
  >({
    mutationFn: ({ id, data }) => unitApi.update(id, data),

    onSuccess: (res, variables) => {
      queryClient.setQueryData(unitKeys.detail(variables.id), res);

      queryClient.invalidateQueries({ queryKey: unitKeys.all });

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Cập nhật đơn vị thất bại");
    },
  });
};

export const useUpdateUnitStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UnitResponse>,
    AxiosError<ErrorResponse>,
    { unitId: string; data: UpdateUnitStatusRequest }
  >({
    mutationFn: ({ unitId, data }) => unitApi.updateStatus(unitId, data),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all });
      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Cập nhật trạng thái thất bại",
      );
    },
  });
};

export const useRemoveUserFromUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    AxiosError<ErrorResponse>,
    { userId: string; unitId: string }
  >({
    mutationFn: ({ userId }) => unitApi.removeUserFromUnit(userId),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all });

      queryClient.invalidateQueries({
        queryKey: unitKeys.detail(variables.unitId),
      });

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Xóa người dùng khỏi đơn vị thất bại",
      );
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (id) => unitApi.remove(id),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all });
      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Xóa đơn vị thất bại");
    },
  });
};
