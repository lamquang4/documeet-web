import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mockRoles } from "../../mocks/mockRoles";
import { Link, useNavigate } from "react-router-dom";

function EditRole() {
  const navigate = useNavigate();
  // const { id } = useParams();
  const [data, setData] = useState({
    roleCode: "",
    roleName: "",
    description: "",
  });

  const role = mockRoles[0];
  const isLoading = false;
  const isLoadingUpdate = false;

  useEffect(() => {
    if (isLoading) return;

    if (!role) {
      toast.error("Chức vụ hệ thống không tìm thấy");
      navigate("/roles");
      return;
    }

    setData({
      roleCode: role.roleCode.toUpperCase() || "",
      roleName: role.roleName || "",
      description: role.description || "",
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
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] bg-[#F1F4F9] h-full">
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
        <h2 className="text-[#74767d]">Chỉnh sửa chức vụ</h2>

        <div className="flex gap-[25px] w-full flex-col">
          <div className="md:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-[#74767d]">Thông tin chức vụ</h5>

            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-[0.9rem] font-medium">
                Mã chức vụ
              </label>
              <input
                type="text"
                name="roleCode"
                value={data.roleCode}
                onChange={handleChange}
                required
                className="uppercase border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-[0.9rem] font-medium">
                Tên chức vụ
              </label>
              <input
                type="text"
                name="roleName"
                value={data.roleName}
                onChange={handleChange}
                required
                className="  border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-[0.9rem] font-medium">
                Mô tả
              </label>

              <input
                type="text"
                name="description"
                value={data.description}
                onChange={handleChange}
                className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <button
            disabled={isLoadingUpdate}
            type="submit"
            className="p-[6px_10px] bg-teal-500 text-white text-[0.9rem] font-medium text-center hover:bg-teal-600 rounded-sm"
          >
            {isLoadingUpdate ? "Đang cập nhật..." : "Cập nhật"}
          </button>
          <Link
            to="/roles"
            className="p-[6px_10px] bg-red-500 text-white text-[0.9rem] text-center hover:bg-red-600 rounded-sm"
          >
            Trờ về
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditRole;
