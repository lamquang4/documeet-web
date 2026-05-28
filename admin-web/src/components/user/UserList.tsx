import Pagination from "../ui/Pagination";
import InputSearch from "../ui/InputSearch";
import { useSearchParams } from "react-router-dom";
import ListHeader from "../ui/list/ListHeader";
import ListBody from "../ui/list/ListBody";

import { useGetAllUsers } from "../../hooks/queries/useUsers";
import type { GetUsersParams } from "../../apis/userApi";
import UserTable from "./UserTable";

function UserList() {
  const [searchParams] = useSearchParams();

  // Đọc từ URL
  const params: GetUsersParams = {
    page: Number(searchParams.get("page") ?? 0),
    size: Number(searchParams.get("size") ?? 12),
    keyword: searchParams.get("keyword") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    role: searchParams.get("role") ?? undefined,
  };

  const { data: usersRes, isLoading } = useGetAllUsers(params);
  const totalItems = usersRes?.data.totalElements ?? 0;
  const totalPages = usersRes?.data.totalPages ?? 0;
  const users = usersRes?.data.content ?? [];

  return (
    <>
      <ListHeader
        title="Người dùng"
        totalItems={totalItems}
        addLink="/users/create"
      />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <UserTable users={users} isLoading={isLoading} />
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

export default UserList;
