import { useState } from "react";
import { Link } from "react-router-dom";
import MultiSearchableSelect from "../ui/MultiSearchableSelect";
import { mockUsersSelect } from "../../mocks/mockUsersSelect";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Select from "../ui/Select";

function AddUnit() {
  const [data, setData] = useState({
    unitCode: "",
    unitName: "",
    status: "",
    userIds: [] as string[],
  });

  const users = mockUsersSelect;

  const userOptions = users.map((user) => ({
    value: user.userId,
    label: user.fullName + (user.unitName ? ` - ${user.unitName}` : ""),
  }));

  const isLoading = false;

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

    setData({
      unitCode: "",
      unitName: "",
      status: "",
      userIds: [] as string[],
    });
  };
  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] bg-[#F1F4F9] h-auto">
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
        <h2 className="text-[#74767d]">Thêm đơn vị</h2>

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
                isRequired={true}
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
                isRequired={true}
                className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
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
                isRequired={true}
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
                isLoading={false}
                setKeyword={() => {}}
                options={userOptions}
                onChange={(val) =>
                  setData((prev) => ({
                    ...prev,
                    userIds: val,
                  }))
                }
                placeholder="Chọn người dùng"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <Button
            isDisabled={isLoading}
            type="submit"
            className="p-[6px_10px] bg-teal-500 text-white text-[0.9rem] font-medium text-center hover:bg-teal-600 rounded-sm"
          >
            {isLoading ? "Đang thêm..." : "Thêm"}
          </Button>
          <Link
            to="/units"
            className="p-[6px_10px] bg-red-500 text-white text-[0.9rem] text-center hover:bg-red-600 rounded-sm"
          >
            Trờ về
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddUnit;
