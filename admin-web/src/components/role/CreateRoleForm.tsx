import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { useCreateRole } from "../../hooks/queries/useRoles";
import FieldError from "../ui/FieldError";
import { roleSchema, type RoleFormData } from "../../schemas/roleSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function CreateRoleForm() {
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

  const createRole = useCreateRole();
  const isLoading = createRole.isPending;

  const onSubmit = async (data: RoleFormData) => {
    createRole.mutate(
      {
        roleCode: data.roleCode.trim(),
        roleName: data.roleName.trim(),
        description: data.description.trim(),
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] h-full">
      <form
        className="flex flex-col gap-7 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-neutral">Thêm chức vụ</h2>

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
                className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400"
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
            disabled={isLoading}
            type="submit"
            className="hover-scale p-[6px_10px] bg-success text-white font-medium text-center rounded-sm"
          >
            {isLoading ? "Đang thêm..." : "Thêm"}
          </Button>

          <Link
            to="/roles"
            className="hover-scale p-[6px_10px] bg-danger text-white text-[0.9rem] text-center rounded-sm"
          >
            Trờ về
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateRoleForm;
