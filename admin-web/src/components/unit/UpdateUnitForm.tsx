import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MultiSearchableSelect from "../ui/MultiSearchableSelect";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Select from "../ui/Select";
import Input from "../ui/Input";
import { useGetUnitById, useUpdateUnit } from "../../hooks/queries/useUnits";
import useDebounce from "../../hooks/useDebounce";
import { useGetSelectedUserForUnit } from "../../hooks/queries/useUsers";
import FieldError from "../ui/FieldError";
import {
  updateUnitSchema,
  type UpdateUnitData,
} from "../../schemas/updateUnitSchema";

function UpdateUnitForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateUnitData>({
    resolver: zodResolver(updateUnitSchema),
    mode: "onBlur",
    defaultValues: {
      unitCode: "",
      unitName: "",
      status: "",
      userIds: [],
    },
  });

  const { data: unitRes, isLoading } = useGetUnitById(id as string);
  const unit = unitRes?.data;

  const updateUnit = useUpdateUnit();
  const isLoadingUpdate = updateUnit.isPending;

  const {
    data: usersRes,
    isLoading: isLoadingUsers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetSelectedUserForUnit(debouncedKeyword);
  const users = usersRes ?? [];

  const userOptions = users.map((u) => ({
    value: u.userId,
    label: `${u.fullName}${u.unitName ? ` - ${u.unitName}` : ""}`,
  }));

  useEffect(() => {
    if (isLoading) return;

    if (!unit) {
      toast.error("Đơn vị không tìm thấy");
      navigate("/units");
      return;
    }

    const userIds = unit.users?.map((u) => u.userId) ?? [];

    reset({
      unitCode: unit.unitCode.toUpperCase() || "",
      unitName: unit.unitName || "",
      status: unit.status || "",
      userIds,
    });
  }, [isLoading, unit, navigate, reset]);

  const onSubmit = async (data: UpdateUnitData) => {
    await updateUnit.mutateAsync({
      id: id ?? "",
      data: {
        unitCode: data.unitCode.trim(),
        unitName: data.unitName.trim(),
        status: data.status as "ACTIVE" | "INACTIVE",
        userIds: data.userIds,
      },
    });
  };

  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] h-auto">
      <form
        className="flex flex-col gap-7 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-neutral">Chỉnh sửa đơn vị</h2>

        <div className="flex gap-[25px] w-full flex-col">
          <div className="md:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-neutral">Thông tin đơn vị</h5>

            <div className="flex flex-col gap-1">
              <Label htmlFor="unitCode" required>
                Mã đơn vị
              </Label>

              <Input
                type="text"
                id="unitCode"
                className="uppercase border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                error={errors.unitCode?.message}
                {...register("unitCode", {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase().trim();
                  },
                })}
              />
              <FieldError message={errors.unitCode?.message} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="unitName" required>
                Tên đơn vị
              </Label>

              <Input
                type="text"
                id="unitName"
                className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                error={errors.unitName?.message}
                {...register("unitName")}
              />
              <FieldError message={errors.unitName?.message} />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="status" required>
                Tình trạng
              </Label>

              <Select
                id="status"
                className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400  "
                error={errors.status?.message}
                {...register("status")}
              >
                <option value="">Chọn tình trạng</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </Select>
              <FieldError message={errors.status?.message} />
            </div>
          </div>

          <div className="md:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-neutral">
              Quản lý thành viên trong đơn vị
            </h5>

            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="">Người dùng trong đơn vị</Label>

              <Controller
                name="userIds"
                control={control}
                render={({ field }) => (
                  <MultiSearchableSelect
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Chọn người dùng"
                    options={userOptions}
                    setKeyword={setKeyword}
                    isLoading={isLoadingUsers}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                  />
                )}
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
            to="/units"
            className="p-[6px_10px] hover-scale bg-danger text-white text-[0.9rem] text-center rounded-sm"
          >
            Trờ về
          </Link>
        </div>
      </form>
    </div>
  );
}

export default UpdateUnitForm;
