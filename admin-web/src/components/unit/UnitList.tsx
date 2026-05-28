import { useSearchParams } from "react-router-dom";
import ListBody from "../ui/list/ListBody";
import ListHeader from "../ui/list/ListHeader";
import InputSearch from "../ui/InputSearch";
import Pagination from "../ui/Pagination";
import type { GetUnitsParams } from "../../apis/unitApi";
import { useGetAllUnits } from "../../hooks/queries/useUnits";
import UnitTable from "./UnitTable";

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

        <UnitTable units={units} isLoading={isLoading} />
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
