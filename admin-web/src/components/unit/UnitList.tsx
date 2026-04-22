import { Link, useSearchParams } from "react-router-dom";
import ListBody from "../ui/list/ListBody";
import ListHeader from "../ui/list/ListHeader";
import FilterDropDownMenu from "../ui/FilterDropDownMenu";
import InputSearch from "../ui/InputSearch";
import Pagination from "../ui/Pagination";
import Loading from "../ui/Loading";
import Image from "../ui/Image";
import ToolTip from "../ui/ToolTip";
import { UNIT_STATUS_OPTIONS } from "../../constant/filterOptions";
import Button from "../ui/Button";
import type { GetUnitsParams } from "../../apis/unitApi";
import {
  useDeleteUnit,
  useGetAllUnits,
  useUpdateUnitStatus,
} from "../../hooks/queries/useUnits";
import Swal from "sweetalert2";
import { LockKeyhole, LockKeyholeOpen, SquarePen, Trash2 } from "lucide-react";
function UnitList() {
  const [searchParams] = useSearchParams();

  // Đọc từ URL
  const params: GetUnitsParams = {
    page: Number(searchParams.get("page") ?? 0),
    size: Number(searchParams.get("size") ?? 12),
    keyword: searchParams.get("keyword") ?? undefined,
  };

  const { data, isLoading } = useGetAllUnits(params);
  const totalItems = data?.data.totalElements ?? 0;
  const totalPages = data?.data.totalPages ?? 0;
  const units = data?.data.content ?? [];

  const deleteUnit = useDeleteUnit();

  const updateStatus = useUpdateUnitStatus();

  const handleDelete = async (unitId: string) => {
    const result = await Swal.fire({
      title: `Xác nhận xóa?`,
      text: `Bạn có chắc muốn xóa đơn vị này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed || !unitId) return;

    deleteUnit.mutate(unitId);
  };

  const handleUpdateStatus = async (
    unitId: string,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    if (!unitId || !status) return;

    const statusConfig: Record<string, { title: string; text: string }> = {
      ACTIVE: {
        title: "Xác nhận kích hoạt đơn vị?",
        text: "Đơn vị sẽ được kích hoạt và hoạt động trở lại.",
      },
      INACTIVE: {
        title: "Xác nhận vô hiệu hóa đơn vị?",
        text: "Đơn vị sẽ bị vô hiệu hóa và tạm ngừng hoạt động.",
      },
    };

    const config = statusConfig[status];

    const result = await Swal.fire({
      title: config.title,
      text: config.text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    updateStatus.mutate({
      unitId: unitId,
      data: { status },
    });
  };
  return (
    <>
      <ListHeader
        addLink="/units/create"
        title="Đơn vị"
        totalItems={totalItems}
      />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
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
                  <td className="p-[1rem]">{unit.unitName}</td>

                  <td className="p-[1rem] font-semibold">
                    {unit.status === "ACTIVE" && "Hoạt động"}
                    {unit.status === "INACTIVE" && "Không hoạt động"}
                  </td>
                  <td className="p-[1rem]">
                    <div className="flex items-center gap-[15px]">
                      <Button
                        className="hover-scale"
                        onClick={() =>
                          handleUpdateStatus(
                            unit.unitId,
                            unit.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                          )
                        }
                      >
                        <div className="relative group">
                          {unit.status === "ACTIVE" && (
                            <LockKeyhole
                              strokeWidth={1.5}
                              size={22}
                              className="text-neutral"
                            />
                          )}
                          {unit.status === "INACTIVE" && (
                            <LockKeyholeOpen
                              strokeWidth={1.5}
                              size={22}
                              className="text-neutral"
                            />
                          )}

                          <ToolTip
                            text={
                              unit.status === "ACTIVE"
                                ? "Vô hiệu hóa đơn vị"
                                : "kích hoạt đơn vị"
                            }
                          />
                        </div>
                      </Button>

                      <Link
                        className="hover-scale"
                        to={`/units/edit/${unit.unitId}`}
                      >
                        <div className="relative group">
                          <SquarePen
                            size={22}
                            strokeWidth={1.5}
                            className="text-info"
                          />

                          <ToolTip text="Chỉnh sửa đơn vị" />
                        </div>
                      </Link>

                      <Button
                        className="hover-scale"
                        onClick={() => handleDelete(unit.unitId || "")}
                      >
                        <div className="relative group">
                          <Trash2
                            size={22}
                            strokeWidth={1.5}
                            className="text-danger"
                          />

                          <ToolTip text="Xóa đơn vị" />
                        </div>
                      </Button>
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
        currentPage={params.page ?? 0}
        size={params.size ?? 12}
        totalItems={totalItems}
      />
    </>
  );
}

export default UnitList;
