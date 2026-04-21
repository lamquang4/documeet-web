import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { userApi, type GetUsersParams } from "../../apis/userApi";
import type {
  ApiResponse,
  CreateUserRequest,
  ErrorResponse,
  PageResponse,
  SelectedUserForUnitResponse,
  UpdateUserRequest,
  UserResponse,
} from "../../types/type";
import type { AxiosError } from "axios";

export const userKeys = {
  all: ["users"] as const,

  lists: () => [...userKeys.all, "list"] as const,

  listParams: (params?: GetUsersParams) =>
    [
      ...userKeys.lists(),
      params?.page ?? 0,
      params?.size ?? 10,
      params?.keyword ?? "",
      params?.status ?? "",
      params?.role ?? "",
    ] as const,

  detail: (id: string) => [...userKeys.all, "detail", id] as const,

  selectedForUnits: () => [...userKeys.all, "selected-for-unit"] as const,
  selectedForUnitParams: (keyword: string) =>
    [...userKeys.selectedForUnits(), keyword] as const,
};

export const useGetAllUsers = (params?: GetUsersParams) => {
  return useQuery<
    ApiResponse<PageResponse<UserResponse>>,
    AxiosError<ErrorResponse>
  >({
    queryKey: userKeys.listParams(params),
    queryFn: () => userApi.getAll(params),
    placeholderData: (prev) => prev,
  });
};

export const useGetSelectedUserForUnit = (keyword: string = "") => {
  return useInfiniteQuery<
    ApiResponse<PageResponse<SelectedUserForUnitResponse>>,
    Error,
    SelectedUserForUnitResponse[],
    ReturnType<typeof userKeys.selectedForUnitParams>,
    number
  >({
    queryKey: userKeys.selectedForUnitParams(keyword),

    queryFn: ({ pageParam = 0 }) =>
      userApi.getSelectedUserForUnit({
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

export const useGetUserById = (id: string) => {
  return useQuery<ApiResponse<UserResponse>, AxiosError<ErrorResponse>>({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UserResponse>,
    AxiosError<ErrorResponse>,
    CreateUserRequest
  >({
    mutationFn: (data) => userApi.create(data),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.selectedForUnits() });
      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Tạo người dùng thất bại");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UserResponse>,
    AxiosError<ErrorResponse>,
    { id: string; data: UpdateUserRequest }
  >({
    mutationFn: ({ id, data }) => userApi.update(id, data),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.selectedForUnits() });

      if (res.data) {
        queryClient.setQueryData(userKeys.detail(variables.id), res);
      } else {
        queryClient.invalidateQueries({
          queryKey: userKeys.detail(variables.id),
        });
      }

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Cập nhật người dùng thất bại",
      );
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (id) => userApi.remove(id),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.selectedForUnits() });
      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Xóa người dùng thất bại");
    },
  });
};

// Status của user
export const useLockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (id) => userApi.lock(id),

    onSuccess: (res, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Khóa người dùng thất bại");
    },
  });
};

export const useUnlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (id) => userApi.unlock(id),

    onSuccess: (res, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Mở khóa người dùng thất bại",
      );
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (id) => userApi.activate(id),

    onSuccess: (res, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Kích hoạt người dùng thất bại",
      );
    },
  });
};
