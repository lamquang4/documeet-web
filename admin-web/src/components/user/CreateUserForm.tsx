import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/validation/validateEmail";
import { validatePhone } from "../../utils/validation/validatePhone";
import SearchableSelect from "../ui/SearchableSelect";
import Button from "../ui/Button";
import Select from "../ui/Select";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { useGetAllRoles } from "../../hooks/queries/useRoles";
import { useCreateUser } from "../../hooks/queries/useUsers";
import { validatePassword } from "../../utils/validation/validatePassword";
import { useGetSelectedUnitForUser } from "../../hooks/queries/useUnits";
import useDebounce from "../../hooks/useDebounce";
import { validateGovernmentId } from "../../utils/validation/validateGovermentId";
import { validateSize } from "../../utils/validation/validateSize";

function CreateUserForm() {
  const [data, setData] = useState({
    fullName: "",
    governmentId: "",
    email: "",
    phoneNumber: "",
    unitId: "",
    roleId: "",
    passwordHash: "",
    repasswordHash: "",
  });
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);

  const createUser = useCreateUser();
  const isLoading = createUser.isPending;

  const { data: rolesRes } = useGetAllRoles({ page: 0, size: 12 });
  const roles = rolesRes?.data.content ?? [];

  const {
    data: unitsRes,
    isLoading: isLoadingUnits,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetSelectedUnitForUser(debouncedKeyword);
  const units = unitsRes ?? [];

  const unitOptions = units.map((unit) => ({
    value: unit.unitId,
    label: unit.unitName,
  }));

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

    if (!data.governmentId.trim()) {
      toast.error("Số định danh cá nhân không được để trống");
      return;
    }

    if (!validateGovernmentId(data.governmentId)) {
      toast.error("Số định danh cá nhân phải gồm đúng 12 chữ số");
      return;
    }

    if (!data.fullName.trim()) {
      toast.error("Họ tên không được để trống");
      return;
    }

    if (!validateSize(data.fullName.trim(), 2, 100)) {
      toast.error("Họ tên phải từ 2 đến 100 ký tự");
      return;
    }

    if (!data.unitId) {
      toast.error("Vui lòng chọn đơn vị");
      return;
    }

    if (!data.roleId) {
      toast.error("Vui lòng chọn chức vụ");
      return;
    }

    if (!data.passwordHash) {
      toast.error("Mật khẩu không được để trống");
      return;
    }

    if (!validateEmail(data.email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    if (!validatePhone(data.phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    if (!validatePassword(data.passwordHash)) {
      toast.error(
        "Mật khẩu phải chứa ít nhất một chữ cái in hoa, một chữ cái thường, một chữ số và một ký tự đặc biệt",
      );
      return;
    }

    if (data.passwordHash !== data.repasswordHash) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }

    createUser.mutate(
      {
        ...data,
        fullName: data.fullName.trim(),
        governmentId: data.governmentId.trim(),
        email: data.email.trim(),
        phoneNumber: data.phoneNumber.trim(),
      },
      {
        onSuccess: () => {
          setData({
            fullName: "",
            governmentId: "",
            email: "",
            phoneNumber: "",
            unitId: "",
            roleId: "",
            passwordHash: "",
            repasswordHash: "",
          });
        },
      },
    );
  };

  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] h-auto">
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
        <h2 className="text-[#74767d]">Thêm người dùng</h2>

        <div className="flex gap-[25px] w-full flex-col">
          <div className="md:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-[#74767d]">Thông tin người dùng</h5>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="" className="text-[0.9rem] font-medium">
                  Số định danh cá nhân
                </Label>
                <Input
                  type="text"
                  name="governmentId"
                  value={data.governmentId}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="" className="text-[0.9rem] font-medium">
                  Số điện thoại
                </Label>
                <Input
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
                <Label htmlFor="" className="text-[0.9rem] font-medium">
                  Họ tên
                </Label>
                <Input
                  type="text"
                  name="fullName"
                  value={data.fullName}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="" className="text-[0.9rem] font-medium">
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  className="lowercase border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                />
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="" className="text-[0.9rem] font-medium">
                  Đơn vị
                </Label>
                <SearchableSelect
                  value={data.unitId}
                  onChange={(val) =>
                    setData((prev) => ({ ...prev, unitId: val }))
                  }
                  placeholder="Chọn đơn vị"
                  options={unitOptions}
                  setKeyword={setKeyword}
                  isLoading={isLoadingUnits}
                  fetchNextPage={fetchNextPage}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="" className="text-[0.9rem] font-medium">
                  Chức vụ
                </Label>
                <Select
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
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="" className="text-[0.9rem] font-medium">
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  name="passwordHash"
                  value={data.passwordHash}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="" className="text-[0.9rem] font-medium">
                  Nhập lại mật khẩu
                </Label>
                <Input
                  type="password"
                  name="repasswordHash"
                  value={data.repasswordHash}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <Button
            disabled={isLoading}
            type="submit"
            className="p-[6px_10px] bg-success text-white text-[0.9rem] font-medium text-center rounded-sm"
          >
            {isLoading ? "Đang thêm..." : "Thêm"}
          </Button>
          <Link
            to="/users"
            className="p-[6px_10px] bg-danger text-white text-[0.9rem] text-center   rounded-sm"
          >
            Trờ về
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateUserForm;
function validateFullName(fullName: string) {
  throw new Error("Function not implemented.");
}
