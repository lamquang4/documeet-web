import { Link, useSearchParams } from "react-router-dom";
import ListBody from "../ui/list/ListBody";
import ListHeader from "../ui/list/ListHeader";
import Loading from "../ui/Loading";
import Pagination from "../ui/Pagination";
import Image from "../ui/Image";
import ToolTip from "../ui/ToolTip";
import Button from "../ui/Button";
import type { GetRolesParams } from "../../apis/roleApi";
import { useDeleteRole, useGetAllRoles } from "../../hooks/queries/useRoles";
import Swal from "sweetalert2";
import InputSearch from "../ui/InputSearch";
import { SquarePen, Trash2 } from "lucide-react";

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

  const deleteRole = useDeleteRole();

  const handleDelete = async (roleId: string) => {
    const result = await Swal.fire({
      title: `Xác nhận xóa?`,
      text: `Bạn có chắc muốn xóa chức vụ này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed || !roleId) return;

    deleteRole.mutate(roleId);
  };

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

        <table className="w-[350%] border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="text-left">
              <th className="p-[1rem]">Mã</th>
              <th className="p-[1rem]">Tên</th>
              <th className="p-[1rem]">Mô tả</th>

              <th className="p-[1rem]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="w-full">
                  <Loading height={60} size={50} color="black" thickness={2} />
                </td>
              </tr>
            ) : roles.length > 0 ? (
              roles.map((role) => (
                <tr key={role.roleId} className="hover:bg-[#f2f3f8]">
                  <td className="p-[1rem] text-[0.9rem]">{role.roleCode}</td>
                  <td className="p-[1rem]">{role.roleName}</td>

                  <td className="p-[1rem] max-w-[250px]">
                    <p className="line-clamp-2 break-words">
                      {role.description}
                    </p>
                  </td>

                  <td className="p-[1rem]">
                    <div className="flex items-center gap-[15px]">
                      <Link
                        to={`/roles/edit/${role.roleId}`}
                        className="hover-scale"
                      >
                        <div className="relative group">
                          <SquarePen
                            size={22}
                            strokeWidth={1.5}
                            className="text-info"
                          />

                          <ToolTip text="Chỉnh sửa chức vụ" />
                        </div>
                      </Link>

                      <Button
                        onClick={() => handleDelete(role.roleId)}
                        disabled={
                          deleteRole.isPending &&
                          deleteRole.variables === role.roleId
                        }
                        className="hover-scale"
                      >
                        <div className="relative group">
                          <Trash2
                            size={22}
                            className="text-danger"
                            strokeWidth={1.5}
                          />

                          <ToolTip text="Xóa chức vụ" />
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

export default RoleList;
