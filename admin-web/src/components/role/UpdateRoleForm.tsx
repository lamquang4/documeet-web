import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Button from "../ui/Button";
import { useGetRoleById, useUpdateRole } from "../../hooks/queries/useRoles";

function UpdateRoleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({
    roleCode: "",
    roleName: "",
    description: "",
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

    setData({
      roleCode: role.roleCode.toUpperCase(),
      roleName: role.roleName,
      description: role.description ?? "",
    });
  }, [isLoading, role, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: name === "roleCode" ? value.toUpperCase().trim() : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.roleCode.trim()) {
      toast.error("Mã chức vụ không được để trống");
      return;
    }

    if (!data.roleName.trim()) {
      toast.error("Tên chức vụ không được để trống");
      return;
    }

    if (!data.description.trim()) {
      toast.error("Mô tả không được để trống");
      return;
    }

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
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
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
                name="roleCode"
                value={data.roleCode}
                onChange={handleChange}
                className="uppercase border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="roleName" required>
                Tên chức vụ
              </Label>

              <Input
                type="text"
                id="roleName"
                name="roleName"
                value={data.roleName}
                onChange={handleChange}
                className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="description" required>
                Mô tả
              </Label>

              <Input
                type="text"
                id="description"
                name="description"
                value={data.description}
                onChange={handleChange}
                className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
              />
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
