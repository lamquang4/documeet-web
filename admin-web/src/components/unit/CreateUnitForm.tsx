import { useState } from "react";
import { Link } from "react-router-dom";
import MultiSearchableSelect from "../ui/MultiSearchableSelect";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { useCreateUnit } from "../../hooks/queries/useUnits";
import useDebounce from "../../hooks/useDebounce";
import { useGetSelectedUserForUnit } from "../../hooks/queries/useUsers";
import { useFormValidation } from "../../hooks/useFromValidation";
import FieldError from "../ui/FieldError";
import { createUnitRules } from "../../utils/validation/rules/createUnitRules";

function CreateUnitForm() {
  const [data, setData] = useState({
    unitCode: "",
    unitName: "",
    userIds: [] as string[],
  });
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);

  const validateData = {
    unitCode: data.unitCode,
    unitName: data.unitName,
  };

  const { errors, handleBlur, clearError, validateAll, resetErrors } =
    useFormValidation(validateData, createUnitRules);

  const createUnit = useCreateUnit();
  const isLoading = createUnit.isPending;

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: name === "unitCode" ? value.toUpperCase().trim() : value,
    });

    clearError(name as keyof typeof validateData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) return;

    createUnit.mutate(
      {
        unitCode: data.unitCode.trim(),
        unitName: data.unitName.trim(),
        userIds: data.userIds,
      },
      {
        onSuccess: () => {
          setData({ unitCode: "", unitName: "", userIds: [] });
          resetErrors();
        },
      },
    );
  };
  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] h-auto">
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
        <h2 className="text-neutral">Thêm đơn vị</h2>

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
                name="unitCode"
                value={data.unitCode}
                onChange={handleChange}
                onBlur={(e) => handleBlur("unitCode", e.target.value)}
                className="uppercase border border-gray-300 p-[6px_10px] w-full focus:border-gray-400"
                error={errors.unitCode}
              />
              <FieldError message={errors.unitCode} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="unitName" required>
                Tên đơn vị
              </Label>

              <Input
                type="text"
                id="unitName"
                name="unitName"
                value={data.unitName}
                onChange={handleChange}
                onBlur={(e) => handleBlur("unitName", e.target.value)}
                className="border border-gray-300 p-[6px_10px] w-full focus:border-gray-400"
                error={errors.unitName}
              />
              <FieldError message={errors.unitName} />
            </div>
          </div>

          <div className="md:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-neutral">
              Quản lý thành viên trong đơn vị
            </h5>

            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="">Người dùng trong đơn vị</Label>

              <MultiSearchableSelect
                value={data.userIds}
                onChange={(val) => setData((p) => ({ ...p, userIds: val }))}
                placeholder="Chọn người dùng"
                options={userOptions}
                setKeyword={setKeyword}
                isLoading={isLoadingUsers}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
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

export default CreateUnitForm;
