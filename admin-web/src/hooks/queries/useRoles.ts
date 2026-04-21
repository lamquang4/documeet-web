import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { roleApi, type GetRolesParams } from "../../apis/roleApi";
import type {
  ApiResponse,
  CreateRoleRequest,
  ErrorResponse,
  PageResponse,
  RoleResponse,
  UpdateRoleRequest,
} from "../../types/type";
import type { AxiosError } from "axios";

// query key
export const roleKeys = {
  all: ["roles"] as const,

  lists: () => [...roleKeys.all, "list"] as const,

  listParams: (params?: GetRolesParams) =>
    [
      ...roleKeys.lists(),
      params?.page ?? 0,
      params?.size ?? 10,
      params?.keyword ?? "",
    ] as const,

  detail: (id: string) => [...roleKeys.all, "detail", id] as const,
};

export const useGetAllRoles = (params?: GetRolesParams) => {
  return useQuery<
    ApiResponse<PageResponse<RoleResponse>>,
    AxiosError<ErrorResponse>
  >({
    queryKey: roleKeys.listParams(params),
    queryFn: () => roleApi.getAll(params),
    placeholderData: (prev) => prev,
  });
};

export const useGetRoleById = (id: string) => {
  return useQuery<ApiResponse<RoleResponse>, AxiosError<ErrorResponse>>({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<RoleResponse>,
    AxiosError<ErrorResponse>,
    CreateRoleRequest
  >({
    mutationFn: roleApi.create,

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.lists(),
      });

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Tạo chức vụ thất bại");
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<RoleResponse>,
    AxiosError<ErrorResponse>,
    { id: string; data: UpdateRoleRequest }
  >({
    mutationFn: ({ id, data }) => roleApi.update(id, data),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.lists(),
      });

      if (res.data) {
        queryClient.setQueryData(roleKeys.detail(variables.id), res);
      } else {
        queryClient.invalidateQueries({
          queryKey: roleKeys.detail(variables.id),
        });
      }

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Cập nhật chức vụ thất bại");
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: roleApi.remove,

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.lists(),
      });
      
      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Xóa chức vụ thất bại");
    },
  });
};
