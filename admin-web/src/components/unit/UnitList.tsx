import { Link } from "react-router-dom";
import { mockUnits } from "../../mocks/mockUnits";
import ListBody from "../list/ListBody";
import ListHeader from "../list/ListHeader";
import FilterDropDownMenu from "../ui/FilterDropDownMenu";
import InputSearch from "../ui/InputSearch";
import { VscTrash } from "react-icons/vsc";
import { LiaEdit } from "react-icons/lia";
import Pagination from "../ui/Pagination";
import Loading from "../ui/Loading";
import Image from "../ui/Image";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import ToolTip from "../ui/ToolTip";
import { UNIT_STATUS_OPTIONS } from "../../constant/filterOptions";
function UnitList() {
  const units = mockUnits;
  const isLoading = false;
  const totalItems = 12;
  const totalPages = 2;
  const currentPage = 1;
  const limit = 12;

  const handleDelete = async (id: string) => {
    if (!id) {
      return;
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!id && !status) {
      return;
    }
  };
  return (
    <>
      <ListHeader
        addLink="/unit/add-unit"
        title="Đơn vị"
        totalItems={totalItems}
      />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] table-fixed border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="text-left">
              <th className="p-[1rem]">Mã đơn vị</th>
              <th className="p-[1rem]">Tên đơn vị</th>

              <th className="p-[1rem]  ">
                <FilterDropDownMenu
                  title="Tình trạng"
                  array={UNIT_STATUS_OPTIONS}
                  paramName="status"
                />
              </th>
              <th className="p-[1rem]  ">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="w-full">
                  <Loading height={60} size={50} color="black" thickness={2} />
                </td>
              </tr>
            ) : units.length > 0 ? (
              units.map((unit) => (
                <tr key={unit.unitId} className="hover:bg-[#f2f3f8]">
                  <td className="p-[1rem] text-[0.9rem]">{unit.unitCode}</td>
                  <td className="p-[1rem]  ">{unit.unitName}</td>

                  <td className="p-[1rem] font-semibold">
                    {unit.status === "ACTIVE" && "Hoạt động"}
                    {unit.status === "INACTIVE" && "Không hoạt động"}
                  </td>
                  <td className="p-[1rem]  ">
                    <div className="flex items-center gap-[15px]">
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            unit.unitId,
                            unit.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                          )
                        }
                      >
                        <div className="relative group">
                          {unit.status === "ACTIVE" && (
                            <FaRegEyeSlash
                              size={22}
                              className="text-[#74767d]"
                            />
                          )}
                          {unit.status === "INACTIVE" && (
                            <MdOutlineRemoveRedEye
                              size={22}
                              className="text-[#74767d]"
                            />
                          )}

                          <ToolTip
                            text={
                              unit.status === "ACTIVE"
                                ? "Cập nhật thành không hoạt động"
                                : "Cập nhật thành hoạt động"
                            }
                          />
                        </div>
                      </button>

                      <Link to={`/unit/edit-unit/${unit.unitId}`}>
                        <div className="relative group">
                          <LiaEdit size={22} className="text-[#076ffe]" />

                          <ToolTip text="Chỉnh sửa đơn vị" />
                        </div>
                      </Link>

                      <button onClick={() => handleDelete(unit.unitId || "")}>
                        <div className="relative group">
                          <VscTrash size={22} className="text-[#d9534f]" />

                          <ToolTip text="Xóa đơn vị" />
                        </div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="w-full h-[70vh]">
                  <div className="flex justify-center items-center">
                    <Image
                      source={"/assets/notfound1.webp"}
                      alt={""}
                      className={"w-[135px]"}
                      loading="lazy"
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ListBody>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        limit={limit}
        totalItems={totalItems}
      />
    </>
  );
}

export default UnitList;
