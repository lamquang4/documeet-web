import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { useCreateRole } from "../../hooks/queries/useRoles";
import toast from "react-hot-toast";

function CreateRoleForm() {
  const [data, setData] = useState({
    roleCode: "",
    roleName: "",
    description: "",
  });

  const createRole = useCreateRole();
  const isLoading = createRole.isPending;

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

    createRole.mutate(
      {
        roleCode: data.roleCode.trim(),
        roleName: data.roleName.trim(),
        description: data.description.trim(),
      },
      {
        onSuccess: () => {
          setData({ roleCode: "", roleName: "", description: "" });
        },
      },
    );
  };

  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] h-full">
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
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
                name="roleCode"
                value={data.roleCode}
                onChange={handleChange}
                className="uppercase border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
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
                className="  border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
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
                className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <Button
            disabled={isLoading}
            type="submit"
            className="hover-scale p-[6px_10px] bg-success text-white text-[0.9rem] font-medium text-center rounded-sm"
          >
            {isLoading ? "Đang thêm..." : "Thêm"}
          </Button>

          <Link
            to="/roles"
            className="hover-scale p-[6px_10px] bg-danger text-white text-[0.9rem] text-center   rounded-sm"
          >
            Trờ về
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateRoleForm;
