import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Button from "../ui/Button";
import { useGetRoleById, useUpdateRole } from "../../hooks/queries/useRoles";
import FieldError from "../ui/FieldError";
import { roleSchema, type RoleFormData } from "../../schemas/roleSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function UpdateRoleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    mode: "onBlur",
    defaultValues: {
      roleCode: "",
      roleName: "",
      description: "",
    },
  });

  const { data: roleRes, isLoading } = useGetRoleById(id as string);
  const role = roleRes?.data;

  const updateRole = useUpdateRole();
  const isLoadingUpdate = updateRole.isPending;

  useEffect(() => {
    if (isLoading) return;

    if (!role) {
      toast.error("Chức vụ không tìm thấy");
      navigate("/roles");
      return;
    }

    reset({
      roleCode: role.roleCode,
      roleName: role.roleName,
      description: role.description ?? "",
    });
  }, [isLoading, role, navigate, reset]);

  const onSubmit = async (data: RoleFormData) => {
    updateRole.mutate({
      id: id ?? "",
      data: {
        roleCode: data.roleCode.trim(),
        roleName: data.roleName.trim(),
        description: data.description.trim(),
      },
    });
  };

  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] h-full">
      <form
        className="flex flex-col gap-7 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-neutral">Chỉnh sửa chức vụ</h2>

        <div className="flex gap-[25px] w-full flex-col">
          <div className="md:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-neutral">Thông tin chức vụ</h5>

            <div className="flex flex-col gap-1">
              <Label htmlFor="roleCode" required>
                Mã chức vụ
              </Label>

              <Input
                type="text"
                id="roleCode"
                className="uppercase border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                error={errors.roleCode?.message}
                {...register("roleCode", {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase().trim();
                  },
                })}
              />
              <FieldError message={errors.roleCode?.message} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="roleName" required>
                Tên chức vụ
              </Label>

              <Input
                type="text"
                id="roleName"
                className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                error={errors.roleName?.message}
                {...register("roleName")}
              />
              <FieldError message={errors.roleName?.message} />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="description" required>
                Mô tả
              </Label>

              <Input
                type="text"
                id="description"
                className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400"
                error={errors.description?.message}
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <Button
            disabled={isLoadingUpdate}
            type="submit"
            className="p-[6px_10px] hover-scale bg-success text-white font-medium text-center rounded-sm"
          >
            {isLoadingUpdate ? "Đang cập nhật..." : "Cập nhật"}
          </Button>

          <Link
            to="/roles"
            className="p-[6px_10px] hover-scale bg-danger text-white text-[0.9rem] text-center rounded-sm"
          >
            Trờ về
          </Link>
        </div>
      </form>
    </div>
  );
}

export default UpdateRoleForm;
