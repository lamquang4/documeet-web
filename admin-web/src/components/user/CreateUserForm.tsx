import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SearchableSelect from "../ui/SearchableSelect";
import Button from "../ui/Button";
import Select from "../ui/Select";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { useGetAllRoles } from "../../hooks/queries/useRoles";
import { useCreateUser } from "../../hooks/queries/useUsers";
import { useGetSelectedUnitForUser } from "../../hooks/queries/useUnits";
import useDebounce from "../../hooks/useDebounce";
import FieldError from "../ui/FieldError";
import {
  createUserSchema,
  type CreateUserData,
} from "../../schemas/userSchema";

function CreateUserForm() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      governmentId: "",
      email: "",
      phoneNumber: "",
      unitId: "",
      roleId: "",
      passwordHash: "",
      repasswordHash: "",
    },
  });

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

  const onSubmit = async (data: CreateUserData) => {
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
          reset();
        },
      },
    );
  };

  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] h-auto">
      <form
        className="flex flex-col gap-7 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
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
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.governmentId?.message}
                  {...register("governmentId")}
                />
                <FieldError message={errors.governmentId?.message} />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="phoneNumber" required>
                  Số điện thoại
                </Label>

                <Input
                  type="text"
                  id="phoneNumber"
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.phoneNumber?.message}
                  {...register("phoneNumber")}
                />
                <FieldError message={errors.phoneNumber?.message} />
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
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />
                <FieldError message={errors.fullName?.message} />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="email" required>
                  Email
                </Label>

                <Input
                  type="text"
                  id="email"
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.email?.message}
                  {...register("email", {
                    onChange: (e) => {
                      e.target.value = e.target.value.toLowerCase();
                    },
                  })}
                />
                <FieldError message={errors.email?.message} />
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="" required>
                  Đơn vị
                </Label>

                <Controller
                  name="unitId"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Chọn đơn vị"
                      options={unitOptions}
                      setKeyword={setKeyword}
                      isLoading={isLoadingUnits}
                      fetchNextPage={fetchNextPage}
                      hasNextPage={hasNextPage}
                      isFetchingNextPage={isFetchingNextPage}
                      onBlur={field.onBlur}
                      error={errors.unitId?.message}
                    />
                  )}
                />
                <FieldError message={errors.unitId?.message} />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="roleId" required>
                  Chức vụ
                </Label>

                <Select
                  id="roleId"
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400"
                  error={errors.roleId?.message}
                  {...register("roleId")}
                >
                  <option value="">Chọn chức vụ</option>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.roleId?.message} />
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
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.passwordHash?.message}
                  {...register("passwordHash")}
                />
                <FieldError message={errors.passwordHash?.message} />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="repasswordHash" required>
                  Nhập lại mật khẩu
                </Label>

                <Input
                  id="repasswordHash"
                  type="password"
                  className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                  error={errors.repasswordHash?.message}
                  {...register("repasswordHash")}
                />
                <FieldError message={errors.repasswordHash?.message} />
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
