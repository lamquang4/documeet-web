import { useSearchParams } from "react-router-dom";
import ListBody from "../ui/list/ListBody";
import ListHeader from "../ui/list/ListHeader";
import Pagination from "../ui/Pagination";
import type { GetRolesParams } from "../../apis/roleApi";
import { useGetAllRoles } from "../../hooks/queries/useRoles";
import InputSearch from "../ui/InputSearch";
import RoleTable from "./RoleTable";

function RoleList() {
  const [searchParams] = useSearchParams();

  // Đọc từ URL
  const params: GetRolesParams = {
    page: Number(searchParams.get("page") ?? 0),
    size: Number(searchParams.get("size") ?? 12),
    keyword: searchParams.get("keyword") ?? undefined,
  };

  const { data, isLoading } = useGetAllRoles(params);
  const totalItems = data?.data.totalElements ?? 0;
  const totalPages = data?.data.totalPages ?? 0;
  const roles = data?.data.content ?? [];

  return (
    <>
      <ListHeader
        addLink="/roles/create"
        title="Chức vụ"
        totalItems={totalItems}
      />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <RoleTable roles={roles} isLoading={isLoading} />
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

export default RoleList;
