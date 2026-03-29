import { mockAuditLogs } from "../../mocks/mockLogs";
import ListBody from "../list/ListBody";
import ListHeader from "../list/ListHeader";
import InputSearch from "../ui/InputSearch";
import Loading from "../ui/Loading";
import Image from "../ui/Image";
import Pagination from "../ui/Pagination";
import FilterDropDownMenu from "../ui/FilterDropDownMenu";
import { LOG_STATUS_OPTIONS } from "../../constant/filterOptions";

function LogList() {
  const arrayModule = [
    { name: "Tất cả", value: null },
    ...Array.from(new Set(mockAuditLogs.map((log) => log.module))).map(
      (module) => ({
        name: module,
        value: module,
      }),
    ),
  ];

  const logs = mockAuditLogs;
  const isLoading = false;
  const totalItems = 12;
  const totalPages = 2;
  const currentPage = 1;
  const limit = 12;
  return (
    <>
      <ListHeader
        title="Nhật ký"
        totalItems={totalItems}
        showDateFilter={true}
      />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] table-fixed border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="text-left">
              <th className="p-[1rem]">Tài khoản</th>
              <th className="p-[1rem]">Mô tả</th>
              <th className="p-[1rem]">Thiết bị</th>
              <th className="p-[1rem]  ">
                <FilterDropDownMenu
                  title="Chức năng"
                  array={arrayModule}
                  paramName="module"
                />
              </th>
              <th className="p-[1rem]">IP</th>
              <th className="p-[1rem]  ">
                <FilterDropDownMenu
                  title="Tình trạng"
                  array={LOG_STATUS_OPTIONS}
                  paramName="status"
                />
              </th>
              <th className="p-[1rem]">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="w-full">
                  <Loading height={60} size={50} color="black" thickness={2} />
                </td>
              </tr>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.logId} className="hover:bg-[#f2f3f8]">
                  <td className="p-[1rem]">
                    <div className="flex flex-col gap-2">
                      <p>{log.user?.fullName}</p>
                      <p>{log.user?.governmentId}</p>
                    </div>
                  </td>

                  <td className="p-[1rem]">{log.description}</td>

                  <td className="p-[1rem]">
                    <div className="flex flex-col gap-2">
                      <p>{log.device?.deviceName}</p>
                      <p>{log.device?.deviceUUID}</p>
                    </div>
                  </td>

                  <td className="p-[1rem] font-semibold">{log.module}</td>
                  <td className="p-[1rem]">{log.ipAddress}</td>

                  <td className="p-[1rem] font-semibold">
                    {log.status === "SUCCESS" && <span>Thành công</span>}
                    {log.status === "FAILED" && <span>Thất bại</span>}
                  </td>

                  <td className="p-[1rem]">
                    {new Date(log.createdDate).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="w-full h-[70vh]">
                  <div className="flex justify-center items-center">
                    <Image
                      source={"/assets/notfound1.png"}
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

export default LogList;
