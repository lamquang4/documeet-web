import { Link } from "react-router-dom";
import { mockRoles } from "../../mocks/mockRoles";
import ListBody from "../ui/list/ListBody";
import ListHeader from "../ui/list/ListHeader";
import InputSearch from "../ui/InputSearch";
import Loading from "../ui/Loading";
import { LiaEdit } from "react-icons/lia";
import { VscTrash } from "react-icons/vsc";
import Pagination from "../ui/Pagination";
import Image from "../ui/Image";
import ToolTip from "../ui/ToolTip";
import Button from "../ui/Button";

function RoleList() {
  const roles = mockRoles;
  const isLoading = false;
  const totalItems = 12;
  const totalPages = 2;
  const currentPage = 1;
  const size = 12;

  const handleDelete = async (id: string) => {
    if (!id) {
      return;
    }
  };

  return (
    <>
      <ListHeader
        addLink="/role/add-role"
        title="Chức vụ"
        totalItems={totalItems}
      />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] table-fixed border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
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
                  <td className="p-[1rem]  ">{role.roleName}</td>

                  <td className="p-[1rem]  ">{role.description}</td>

                  <td className="p-[1rem]  ">
                    <div className="flex items-center gap-[15px]">
                      <Link to={`/role/edit-role/${role.roleId}`}>
                        <div className="relative group">
                          <LiaEdit size={22} className="text-info" />

                          <ToolTip text="Chỉnh sửa chức vụ" />
                        </div>
                      </Link>

                      <Button onClick={() => handleDelete(role.roleId || "")}>
                        <div className="relative group">
                          <VscTrash size={22} className="text-danger" />

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
        currentPage={currentPage}
        size={size}
        totalItems={totalItems}
      />
    </>
  );
}

export default RoleList;
