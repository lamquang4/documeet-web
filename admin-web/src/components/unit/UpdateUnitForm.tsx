import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import MultiSearchableSelect from "../ui/MultiSearchableSelect";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Select from "../ui/Select";
import Input from "../ui/Input";
import {
  useGetUnitById,
  useRemoveUserFromUnit,
  useUpdateUnit,
} from "../../hooks/queries/useUnits";
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
  const [originalUserIds, setOriginalUserIds] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);

  const { data: unitRes, isLoading } = useGetUnitById(id as string);

  const updateUnit = useUpdateUnit();

  const removeUserFromUnit = useRemoveUserFromUnit();

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

    const unit = unitRes?.data;

    if (!unit) {
      toast.error("Đơn vị không tìm thấy");
      navigate("/units");
      return;
    }

    setData({
      unitCode: unit.unitCode.toUpperCase() || "",
      unitName: unit.unitName || "",
      status: unit.status || "",
      userIds: unit.userIds || [],
    });

    setOriginalUserIds(unit.userIds ?? []);
  }, [isLoading, unitRes, navigate]);

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

    const addedUserIds = data.userIds.filter(
      (uid) => !originalUserIds.includes(uid),
    );
    const removedUserIds = originalUserIds.filter(
      (uid) => !data.userIds.includes(uid),
    );

    if (removedUserIds.length > 0) {
      await Promise.all(
        removedUserIds.map((userId) =>
          removeUserFromUnit.mutateAsync({ userId, unitId: id ?? "" }),
        ),
      );
    }

    // Cập nhật unit — với userIds là những user mới thêm vào đơn vị
    updateUnit.mutate({
      id: id ?? "",
      data: {
        unitCode: data.unitCode.trim(),
        unitName: data.unitName.trim(),
        status: data.status as "ACTIVE" | "INACTIVE",
        userIds: addedUserIds,
      },
    });
  };

  const isLoadingUpdate = updateUnit.isPending || removeUserFromUnit.isPending;
  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] h-auto">
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
        <h2 className="text-[#74767d]">Chỉnh sửa đơn vị</h2>

        <div className="flex gap-[25px] w-full flex-col">
          <div className="md:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-[#74767d]">Thông tin đơn vị</h5>

            <div className="flex flex-col gap-1">
              <Label htmlFor="" className="text-[0.9rem] font-medium">
                Mã đơn vị
              </Label>
              <Input
                type="text"
                name="unitCode"
                value={data.unitCode}
                onChange={handleChange}
                required
                className="uppercase border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="" className="text-[0.9rem] font-medium">
                Tên đơn vị
              </Label>
              <Input
                type="text"
                name="unitName"
                value={data.unitName}
                onChange={handleChange}
                required
                className="  border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="" className="text-[0.9rem] font-medium">
                Tình trạng
              </Label>
              <Select
                name="status"
                value={data.status}
                onChange={handleChange}
                required
                className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              >
                <option value="">Chọn tình trạng</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </Select>
            </div>
          </div>

          <div className="md:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-[#74767d]">Người trong đơn vị</h5>

            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="" className="text-[0.9rem] font-medium">
                Người dùng
              </Label>
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
