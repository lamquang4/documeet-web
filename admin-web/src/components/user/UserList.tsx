import { VscTrash } from "react-icons/vsc";
import { LiaEdit } from "react-icons/lia";
import { TbLock, TbLockOpen } from "react-icons/tb";
import { SiTicktick } from "react-icons/si";
import Pagination from "../ui/Pagination";
import FilterDropDownMenu from "../ui/FilterDropDownMenu";
import InputSearch from "../ui/InputSearch";
import { Link } from "react-router-dom";
import ListHeader from "../list/ListHeader";
import ListBody from "../list/ListBody";
import { mockUsers } from "../../mocks/mockUsers";
import Loading from "../ui/Loading";
import Image from "../ui/Image";
import ToolTip from "../ui/ToolTip";
import { mockRolesFilter } from "../../mocks/mockRolesFilter";
import { USER_STATUS_OPTIONS } from "../../constant/filterOptions";

function UserList() {
  const roles = mockRolesFilter;

  const arrayRoles = [
    { name: "Tất cả", value: null },
    ...roles.map((role) => ({
      name: role.roleName,
      value: role.roleCode,
    })),
  ];

  const users = mockUsers;
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

  const getNextStatus = (status: string) => {
    if (status === "DISABLED") return "ACTIVE";
    if (status === "ACTIVE") return "LOCKED";
    if (status === "LOCKED") return "ACTIVE";
    return status;
  };

  return (
    <>
      <ListHeader title="Người dùng" totalItems={totalItems} />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] table-fixed border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="text-left">
              <th className="p-[1rem]">Số định danh cá nhân</th>
              <th className="p-[1rem]">Số điện thoại</th>
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
                    {user.status === "ACTIVE" && "Bình thường"}
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
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            user.userId,
                            getNextStatus(user.status),
                          )
                        }
                      >
                        <div className="relative group">
                          {user.status === "DISABLED" && (
                            <SiTicktick size={18} className="text-green-500" />
                          )}

                          {user.status === "ACTIVE" && (
                            <TbLock size={22} className="text-[#74767d]" />
                          )}

                          {user.status === "LOCKED" && (
                            <TbLockOpen size={22} className="text-[#74767d]" />
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
                      </button>

                      <Link to={`/user/edit-user/${user.userId}`}>
                        <div className="relative group">
                          <LiaEdit size={22} className="text-[#076ffe]" />

                          <ToolTip text={"Chỉnh sửa người dùng"} />
                        </div>
                      </Link>

                      <button onClick={() => handleDelete(user.userId || "")}>
                        <div className="relative group">
                          <VscTrash size={22} className="text-[#d9534f]" />
                          <ToolTip text={"Xóa người dùng"} />
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

export default UserList;
