import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { mockUsers } from "../../mocks/mockUsers";
import { validateEmail } from "../../utils/validateEmail";
import { validatePhone } from "../../utils/validatePhone";
import SearchableSelect from "../ui/SearchableSelect";
import { mockRolesSelect } from "../../mocks/mockRolesSelect";
import { mockUnitsSelect } from "../../mocks/mockUnisSelect";

function EditUser() {
  const navigate = useNavigate();
  // const { id } = useParams();
  const [data, setData] = useState({
    fullName: "",
    governmentId: "",
    email: "",
    phoneNumber: "",
    unitId: "",
    roleId: "",
    status: "",
  });

  const user = mockUsers[1];
  const roles = mockRolesSelect;
  const units = mockUnitsSelect;
  const isLoading = false;
  const isLoadingUpdate = false;

  const unitOptions = units.map((unit) => ({
    value: unit.unitId,
    label: unit.unitName,
  }));

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      toast.error("Người dùng không tìm thấy");
      navigate("/users");
      return;
    }

    setData({
      fullName: user.fullName || "",
      governmentId: user.governmentId || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      unitId: user?.unit?.unitId || "",
      roleId: user?.role?.roleId || "",
      status: user.status?.toString() || "",
    });
  }, [isLoading, user, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(data.email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    if (!validatePhone(data.phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    setData((prev) => ({
      ...prev,
      password: "",
    }));
  };

  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] bg-[#F1F4F9] h-auto">
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
        <h2 className="text-[#74767d]">Chỉnh sửa người dùng</h2>

        <div className="flex gap-[25px] w-full flex-col">
          <div className="md:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-[#74767d]">Thông tin tài khoản</h5>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-[0.9rem] font-medium">
                  Số định danh cá nhân
                </label>
                <input
                  type="text"
                  name="governmentId"
                  value={data.governmentId}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-[0.9rem] font-medium">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={data.phoneNumber}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                />
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-[0.9rem] font-medium">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={data.fullName}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-[0.9rem] font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  className="lowercase border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-[0.9rem] font-medium">
                Đơn vị
              </label>
              <SearchableSelect
                isLoading={false}
                setKeyword={() => {}}
                options={unitOptions}
                value={data.unitId}
                onChange={(val) =>
                  setData((prev) => ({
                    ...prev,
                    unitId: val,
                  }))
                }
                placeholder="Chọn đơn vị"
              />
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-[0.9rem] font-medium">
                  Chức vụ
                </label>
                <select
                  name="roleId"
                  value={data.roleId}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                >
                  <option value="">Chọn chức vụ</option>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-[0.9rem] font-medium">
                  Tình trạng
                </label>
                <select
                  name="status"
                  value={data.status}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400"
                >
                  <option value="">Chọn tình trạng</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="LOCKED">Bị khóa</option>
                  <option value="DISABLED">Vô hiệu hóa</option>
                </select>
              </div>
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
            to="/users"
            className="p-[6px_10px] bg-red-500 text-white text-[0.9rem] text-center hover:bg-red-600 rounded-sm"
          >
            Trờ về
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
