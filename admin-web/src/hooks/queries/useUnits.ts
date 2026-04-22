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

  lists: () => [...unitKeys.all, "list"] as const,
  listParams: (params?: GetUnitsParams) =>
    [
      ...unitKeys.lists(),
      params?.page ?? 0,
      params?.size ?? 10,
      params?.keyword ?? "",
    ] as const,

  detail: (id: string) => [...unitKeys.all, "detail", id] as const,

  selectedForUsers: () => [...unitKeys.all, "selected-for-user"] as const,
  selectedForUserParams: (keyword: string) =>
    [...unitKeys.selectedForUsers(), keyword] as const,
};

export const useGetAllUnits = (params?: GetUnitsParams) => {
  return useQuery<
    ApiResponse<PageResponse<UnitResponse>>,
    AxiosError<ErrorResponse>
  >({
    queryKey: unitKeys.listParams(params),
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

export const useGetSelectedUnitForUser = (keyword: string = "") => {
  return useInfiniteQuery<
    ApiResponse<PageResponse<SelectedUnitForUserResponse>>,
    Error,
    SelectedUnitForUserResponse[],
    ReturnType<typeof unitKeys.selectedForUserParams>,
    number
  >({
    queryKey: unitKeys.selectedForUserParams(keyword),

    queryFn: ({ pageParam = 0 }) =>
      unitApi.getSelectedUnitForUser({
        page: pageParam as number,
        size: 10,
        keyword,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      const page = lastPage?.data?.page ?? 0;
      const totalPages = lastPage?.data?.totalPages ?? 0;
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
    mutationFn: unitApi.create,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: unitKeys.selectedForUsers() });

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
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: unitKeys.selectedForUsers() });
      queryClient.invalidateQueries({
        queryKey: unitKeys.detail(variables.id),
      });

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

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: unitKeys.detail(variables.unitId),
      });

      toast.success(res.message || "Cập nhật trạng thái thành công");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: unitApi.remove,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: unitKeys.selectedForUsers() });

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Xóa đơn vị thất bại");
    },
  });
};
