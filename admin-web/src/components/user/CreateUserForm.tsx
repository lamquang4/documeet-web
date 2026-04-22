import { useState } from "react";
import { Link } from "react-router-dom";
import SearchableSelect from "../ui/SearchableSelect";
import Button from "../ui/Button";
import Select from "../ui/Select";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { useGetAllRoles } from "../../hooks/queries/useRoles";
import { useCreateUser } from "../../hooks/queries/useUsers";
import { useGetSelectedUnitForUser } from "../../hooks/queries/useUnits";
import useDebounce from "../../hooks/useDebounce";
import { createUserRules } from "../../utils/validation/rules/createUserRules";
import { useFormValidation } from "../../hooks/useFromValidation";
import FieldError from "../ui/FieldError";

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

  const { errors, handleBlur, clearError, validateAll, resetErrors } =
    useFormValidation(data, createUserRules);

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

    clearError(name as keyof typeof data);
  };

  const handleUnitChange = (val: string) => {
    setData((prev) => ({ ...prev, unitId: val }));

    handleBlur("unitId", val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) return;

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
          resetErrors();
        },
      },
    );
  };

  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] h-auto">
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
        <h2 className="text-neutral">Thêm người dùng</h2>

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
                  onChange={handleUnitChange}
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
                <Label htmlFor="passwordHash" required>
                  Mật khẩu
                </Label>

                <Input
                  type="password"
                  id="passwordHash"
                  name="passwordHash"
                  value={data.passwordHash}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("passwordHash", e.target.value)}
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.passwordHash}
                />
                <FieldError message={errors.passwordHash} />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="repasswordHash" required>
                  Nhập lại mật khẩu
                </Label>

                <Input
                  id="repasswordHash"
                  type="password"
                  name="repasswordHash"
                  value={data.repasswordHash}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("repasswordHash", e.target.value)}
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.repasswordHash}
                />
                <FieldError message={errors.repasswordHash} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <Button
            disabled={isLoading}
            type="submit"
            className="p-[6px_10px] hover-scale bg-success text-white font-medium text-center rounded-sm"
          >
            {isLoading ? "Đang thêm..." : "Thêm"}
          </Button>
          <Link
            to="/users"
            className="p-[6px_10px] hover-scale bg-danger text-white text-[0.9rem] text-center   rounded-sm"
          >
            Trờ về
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateUserForm;
