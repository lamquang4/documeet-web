import { VscTrash } from "react-icons/vsc";
import { LiaEdit } from "react-icons/lia";
import { TbLock, TbLockOpen } from "react-icons/tb";
import { SiTicktick } from "react-icons/si";
import Pagination from "../ui/Pagination";
import FilterDropDownMenu from "../ui/FilterDropDownMenu";
import InputSearch from "../ui/InputSearch";
import { Link, useSearchParams } from "react-router-dom";
import ListHeader from "../ui/list/ListHeader";
import ListBody from "../ui/list/ListBody";
import Loading from "../ui/Loading";
import Image from "../ui/Image";
import ToolTip from "../ui/ToolTip";
import { USER_STATUS_OPTIONS } from "../../constant/filterOptions";
import Button from "../ui/Button";
import Swal from "sweetalert2";
import { useGetAllRoles } from "../../hooks/queries/useRoles";
import {
  useActivateUser,
  useDeleteUser,
  useGetAllUsers,
  useLockUser,
  useUnlockUser,
} from "../../hooks/queries/useUsers";
import type { GetUsersParams } from "../../apis/userApi";

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

  const { data: rolesRes } = useGetAllRoles({ page: 1, size: 12 });
  const roles = rolesRes?.data.content ?? [];

  const { data: usersRes, isLoading } = useGetAllUsers(params);
  const totalItems = usersRes?.data.totalElements ?? 0;
  const totalPages = usersRes?.data.totalPages ?? 0;
  const users = usersRes?.data.content ?? [];

  const deleteUser = useDeleteUser();

  const lockUser = useLockUser();
  const unlockUser = useUnlockUser();
  const activateUser = useActivateUser();

  const arrayRoles = [
    { name: "Tất cả", value: null },
    ...roles.map((role) => ({
      name: role.roleName,
      value: role.roleCode,
    })),
  ];

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: `Xác nhận xóa?`,
      text: `Bạn có chắc muốn xóa người dùng này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed || !id) return;

    deleteUser.mutate(id);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!id || !status) return;

    if (status === "LOCKED") {
      const result = await Swal.fire({
        title: "Khóa người dùng?",
        text: "Người dùng sẽ không thể đăng nhập",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Khóa",
        cancelButtonText: "Hủy",
      });

      if (!result.isConfirmed) return;

      lockUser.mutate(id);
      return;
    }

    if (status === "ACTIVE") {
      unlockUser.mutate(id);
    } else if (status === "DISABLED") {
      activateUser.mutate(id);
    }
  };

  const getNextStatus = (status: string) => {
    if (status === "DISABLED") return "ACTIVE";
    if (status === "ACTIVE") return "LOCKED";
    if (status === "LOCKED") return "ACTIVE";
    return status;
  };

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

        <table className="w-[350%] border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="text-left">
              <th className="p-[1rem]">Số định danh</th>
              <th className="p-[1rem]">SĐT</th>
              <th className="p-[1rem]">Họ tên</th>
              <th className="p-[1rem]">Đơn vị</th>
              <th className="p-[1rem]  ">
                <FilterDropDownMenu
                  title="Chức vụ"
                  array={arrayRoles}
                  paramName="role"
                />
              </th>
              <th className="p-[1rem]  ">
                <FilterDropDownMenu
                  title="Tình trạng"
                  array={USER_STATUS_OPTIONS}
                  paramName="status"
                />
              </th>
              <th className="p-[1rem]  ">Lần đăng nhập cuối</th>
              <th className="p-[1rem]  ">Ngày mở khóa</th>

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
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.userId} className="hover:bg-[#f2f3f8]">
                  <td className="p-[1rem] text-[0.9rem]">
                    {user.governmentId}
                  </td>
                  <td className="p-[1rem]  ">{user.phoneNumber}</td>

                  <td className="p-[1rem]  ">{user.fullName}</td>

                  <td className="p-[1rem]  ">{user.unit?.unitName}</td>

                  <td className="p-[1rem]  ">{user.role?.roleName}</td>

                  <td className="p-[1rem] font-semibold">
                    {user.status === "ACTIVE" && "Hoạt động"}
                    {user.status === "LOCKED" && "Bị khóa"}
                    {user.status === "DISABLED" && "Vô hiệu hóa"}
                  </td>

                  <td className="p-[1rem]">
                    {user?.lastLoginDate &&
                      new Date(user.lastLoginDate).toLocaleString("vi-VN")}
                  </td>

                  <td className="p-[1rem]">
                    {user?.lockoutEndTime &&
                      new Date(user?.lockoutEndTime).toLocaleString("vi-VN")}
                  </td>

                  <td className="p-[1rem]  ">
                    <div className="flex items-center gap-[15px]">
                      <Button
                        onClick={() =>
                          handleUpdateStatus(
                            user.userId,
                            getNextStatus(user.status),
                          )
                        }
                      >
                        <div className="relative group">
                          {user.status === "DISABLED" && (
                            <SiTicktick size={18} className="text-success" />
                          )}

                          {user.status === "ACTIVE" && (
                            <TbLock size={22} className="text-neutral" />
                          )}

                          {user.status === "LOCKED" && (
                            <TbLockOpen size={22} className="text-neutral" />
                          )}

                          <ToolTip
                            text={
                              user.status === "DISABLED"
                                ? "Duyệt tài khoản"
                                : user.status === "ACTIVE"
                                  ? "Khóa người dùng"
                                  : "Mở khóa người dùng"
                            }
                          />
                        </div>
                      </Button>

                      <Link to={`/users/edit/${user.userId}`}>
                        <div className="relative group">
                          <LiaEdit size={22} className="text-info" />

                          <ToolTip text={"Chỉnh sửa người dùng"} />
                        </div>
                      </Link>

                      <Button onClick={() => handleDelete(user.userId || "")}>
                        <div className="relative group">
                          <VscTrash size={22} className="text-danger" />
                          <ToolTip text={"Xóa người dùng"} />
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

export default UserList;
