import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import SearchableSelect from "../ui/SearchableSelect";
import Button from "../ui/Button";
import Select from "../ui/Select";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { useGetUserById, useUpdateUser } from "../../hooks/queries/useUsers";
import { useGetAllRoles } from "../../hooks/queries/useRoles";
import useDebounce from "../../hooks/useDebounce";
import { useGetSelectedUnitForUser } from "../../hooks/queries/useUnits";
import { useFormValidation } from "../../hooks/useFromValidation";
import { updateUserRules } from "../../utils/validation/rules/updateUserRules";
import FieldError from "../ui/FieldError";

function UpdateUserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({
    fullName: "",
    governmentId: "",
    email: "",
    phoneNumber: "",
    unitId: "",
    roleId: "",
    status: "",
    passwordHash: "",
  });
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);

  const { errors, handleBlur, clearError, validateAll, resetErrors } =
    useFormValidation(data, updateUserRules);

  const account = JSON.parse(localStorage.getItem("user") || "null");

  const { data: userRes, isLoading } = useGetUserById(id as string);
  const user = userRes?.data;

  const updateUser = useUpdateUser();
  const isLoadingUpdate = updateUser.isPending;

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
      passwordHash: "",
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

    clearError(name as keyof typeof data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) return;

    if (data.status === "LOCKED" && user?.userId === account.userId) {
      toast.error("Bạn không thể khóa chính tài khoản của mình");
      return;
    }

    updateUser.mutate(
      {
        id: id ?? "",
        data: {
          fullName: data.fullName.trim(),
          governmentId: data.governmentId.trim(),
          email: data.email.trim(),
          phoneNumber: data.phoneNumber.trim(),
          unitId: data.unitId,
          roleId: data.roleId,
          status: data.status as "ACTIVE" | "LOCKED" | "DISABLED",
          passwordHash: data.passwordHash,
        },
      },
      {
        onSuccess: () => {
          setData((prev) => ({
            ...prev,
            passwordHash: "",
          }));
          resetErrors();
        },
      },
    );
  };

  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] h-auto">
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
        <h2 className="text-neutral">Chỉnh sửa người dùng</h2>

        <div className="flex gap-[25px] w-full flex-col">
          <div className="md:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-neutral">Thông tin người dùng</h5>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="governmentId" required>
                  Số định danh cá nhân
                </Label>

                <Input
                  type="text"
                  id="governmentId"
                  name="governmentId"
                  value={data.governmentId}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("governmentId", e.target.value)}
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.governmentId}
                />
                <FieldError message={errors.governmentId} />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="phoneNumber" required>
                  Số điện thoại
                </Label>

                <Input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={data.phoneNumber}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("phoneNumber", e.target.value)}
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.phoneNumber}
                />
                <FieldError message={errors.phoneNumber} />
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="fullName" required>
                  Họ tên
                </Label>

                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={data.fullName}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("fullName", e.target.value)}
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.fullName}
                />
                <FieldError message={errors.fullName} />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="email" required>
                  Email
                </Label>

                <Input
                  type="text"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("email", e.target.value)}
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.email}
                />
                <FieldError message={errors.email} />
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="" required>
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
                  onBlur={() => handleBlur("unitId", data.unitId)}
                  error={errors.unitId}
                />
                <FieldError message={errors.unitId} />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="roleId" required>
                  Chức vụ
                </Label>

                <Select
                  id="roleId"
                  name="roleId"
                  value={data.roleId}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("roleId", e.target.value)}
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400"
                  error={errors.roleId}
                >
                  <option value="">Chọn chức vụ</option>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.roleId} />
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="status" required>
                  Tình trạng
                </Label>

                <Select
                  id="status"
                  name="status"
                  value={data.status}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("status", e.target.value)}
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400"
                  error={errors.status}
                >
                  <option value="">Chọn tình trạng</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="LOCKED">Bị khóa</option>
                  <option value="DISABLED">Vô hiệu hóa</option>
                </Select>
                <FieldError message={errors.status} />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="passwordHash">Mật khẩu mới</Label>

                <Input
                  type="password"
                  name="passwordHash"
                  value={data.passwordHash}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("passwordHash", e.target.value)}
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.passwordHash}
                />
                <FieldError message={errors.passwordHash} />
              </div>
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
            to="/users"
            className="p-[6px_10px] hover-scale bg-danger text-white text-[0.9rem] text-center rounded-sm"
          >
            Trờ về
          </Link>
        </div>
      </form>
    </div>
  );
}

export default UpdateUserForm;
