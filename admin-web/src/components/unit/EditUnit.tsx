import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { mockUnits } from "../../mocks/mockUnits";
import SearchableSelect from "../ui/SearchableSelect";

function EditUnit() {
  const navigate = useNavigate();
  // const { id } = useParams();
  const [data, setData] = useState({
    parentId: "",
    unitCode: "",
    unitName: "",
    level: 1,
    status: "",
  });

  const isLoading = false;
  const isLoadingUpdate = false;

  const unit = mockUnits[1];
  const units = mockUnits;
  const unitOptions = units.map((unit) => ({
    value: unit.unitId,
    label: unit.unitName,
  }));

  useEffect(() => {
    if (isLoading) return;

    if (!unit) {
      toast.error("Đơn vị không tìm thấy");
      navigate("/units");
      return;
    }

    setData({
      parentId: unit?.parent?.parentId || "",
      unitCode: unit.unitCode.toUpperCase() || "",
      unitName: unit.unitName || "",
      level: unit.level || 1,
      status: unit.status || "",
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
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setData((prev) => ({
        ...prev,
        password: "",
      }));
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };
  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] bg-[#F1F4F9] h-full">
      <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
        <h2 className="text-[#74767d]">Thêm chức vụ</h2>

        <div className="flex gap-[25px] w-full flex-col">
          <div className="md:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-[#74767d]">Thông tin chức vụ</h5>

            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-[0.9rem] font-medium">
                Mã đơn vị
              </label>
              <input
                type="text"
                name="unitCode"
                value={data.unitCode}
                onChange={handleChange}
                required
                className="uppercase border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-[0.9rem] font-medium">
                Tên đơn vị
              </label>
              <input
                type="text"
                name="unitName"
                value={data.unitName}
                onChange={handleChange}
                required
                className="  border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-[0.9rem] font-medium">
                  Cấp bậc đơn vị
                </label>
                <select
                  name="level"
                  value={data.level}
                  onChange={handleChange}
                  required
                  className="  border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
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
                  className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                >
                  <option value="">Chọn tình trạng</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Không hoạt động</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-[0.9rem] font-medium">
                Đơn vị cha
              </label>
              <SearchableSelect
                options={unitOptions}
                value={data.parentId}
                onChange={(val) =>
                  setData((prev) => ({
                    ...prev,
                    parentId: val,
                  }))
                }
                placeholder="Chọn đơn vị cha"
              />
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

export default EditUnit;
