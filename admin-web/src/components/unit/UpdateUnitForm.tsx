import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import MultiSearchableSelect from "../ui/MultiSearchableSelect";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Select from "../ui/Select";
import Input from "../ui/Input";
import { useGetUnitById, useUpdateUnit } from "../../hooks/queries/useUnits";
import useDebounce from "../../hooks/useDebounce";
import { useGetSelectedUserForUnit } from "../../hooks/queries/useUsers";

function UpdateUnitForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({
    unitCode: "",
    unitName: "",
    status: "",
    userIds: [] as string[],
  });
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);

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

    setData({
      unitCode: unit.unitCode.toUpperCase() || "",
      unitName: unit.unitName || "",
      status: unit.status || "",
      userIds: userIds,
    });
  }, [isLoading, unit, navigate]);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.unitCode.trim()) {
      toast.error("Mã đơn vị không được để trống");
      return;
    }

    if (!data.unitName.trim()) {
      toast.error("Tên đơn vị không được để trống");
      return;
    }

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
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
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
                name="unitCode"
                value={data.unitCode}
                onChange={handleChange}
                className="uppercase border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
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
                className="  border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="status" required>
                Tình trạng
              </Label>

              <Select
                name="status"
                id="status"
                value={data.status}
                onChange={handleChange}
                className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              >
                <option value="">Chọn tình trạng</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </Select>
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
            disabled={isLoadingUpdate}
            type="submit"
            className="p-[6px_10px] bg-success text-white text-[0.9rem] font-medium text-center rounded-sm"
          >
            {isLoadingUpdate ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
          <Link
            to="/units"
            className="p-[6px_10px] bg-danger text-white text-[0.9rem] text-center   rounded-sm"
          >
            Trờ về
          </Link>
        </div>
      </form>
    </div>
  );
}

export default UpdateUnitForm;
