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
import {
  CircleCheckBig,
  LockKeyhole,
  LockKeyholeOpen,
  SquarePen,
  Trash2,
} from "lucide-react";
import { parseSafeDate } from "../../utils/dateUtil";
import toast from "react-hot-toast";

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

  const account = JSON.parse(localStorage.getItem("user") || "null");

  const { data: rolesRes } = useGetAllRoles({ page: 0, size: 12 });
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

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: `Xác nhận xóa?`,
      text: `Bạn có chắc muốn xóa người dùng này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed || !userId) return;

    deleteUser.mutate(userId);
  };

  const handleUpdateStatus = async (
    userId: string,
    status: "ACTIVE" | "LOCKED" | "DISABLED",
  ) => {
    if (!userId || !status) return;

    if (status === "LOCKED" && userId === account.userId) {
      toast.error("Bạn không thể khóa chính tài khoản của mình");
      return;
    }

    const statusConfig: Record<
      string,
      { title: string; text: string; confirmButtonText: string }
    > = {
      LOCKED: {
        title: "Xác nhận khóa người dùng?",
        text: "Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa.",
        confirmButtonText: "Khóa",
      },
      ACTIVE: {
        title: "Xác nhận mở khóa người dùng?",
        text: "Người dùng sẽ có thể đăng nhập trở lại.",
        confirmButtonText: "Mở khóa",
      },
      DISABLED: {
        title: "Xác nhận duyệt tài khoản?",
        text: "Tài khoản sẽ được kích hoạt và người dùng có thể đăng nhập.",
        confirmButtonText: "Duyệt",
      },
    };

    const config = statusConfig[status];
    if (!config) return;

    const result = await Swal.fire({
      title: config.title,
      text: config.text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: config.confirmButtonText,
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    if (status === "LOCKED") lockUser.mutate(userId);
    if (status === "ACTIVE") unlockUser.mutate(userId);
    if (status === "DISABLED") activateUser.mutate(userId);
  };

  const getNextStatus = (status: string): "ACTIVE" | "LOCKED" | "DISABLED" => {
    if (status === "DISABLED") return "ACTIVE";
    if (status === "ACTIVE") return "LOCKED";
    if (status === "LOCKED") return "ACTIVE";
    return "ACTIVE";
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
                      parseSafeDate(user?.lastLoginDate)?.toLocaleString(
                        "vi-VN",
                      )}
                  </td>

                  <td className="p-[1rem]">
                    {user?.lockoutEndTime &&
                      parseSafeDate(user?.lockoutEndTime)?.toLocaleString(
                        "vi-VN",
                      )}
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
                            <CircleCheckBig
                              size={22}
                              strokeWidth={1.5}
                              className="text-success"
                            />
                          )}

                          {user.status === "ACTIVE" && (
                            <LockKeyhole
                              strokeWidth={1.5}
                              size={22}
                              className="text-neutral"
                            />
                          )}

                          {user.status === "LOCKED" && (
                            <LockKeyholeOpen
                              strokeWidth={1.5}
                              size={22}
                              className="text-neutral"
                            />
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
                          <SquarePen
                            size={22}
                            strokeWidth={1.5}
                            className="text-info"
                          />

                          <ToolTip text={"Chỉnh sửa người dùng"} />
                        </div>
                      </Link>

                      <Button onClick={() => handleDelete(user.userId || "")}>
                        <div className="relative group">
                          <Trash2
                            size={22}
                            strokeWidth={1.5}
                            className="text-danger"
                          />
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
