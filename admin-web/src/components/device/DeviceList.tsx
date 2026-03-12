import { mockDevices } from "../../mocks/mockDevices";
import ListBody from "../list/ListBody";
import ListHeader from "../list/ListHeader";
import InputSearch from "../ui/InputSearch";
import Loading from "../ui/Loading";
import Pagination from "../ui/Pagination";
import Image from "../ui/Image";
import FilterDropDownMenu from "../ui/FilterDropDownMenu";
import { LuPaintbrush } from "react-icons/lu";
import {
  TbDeviceMobile,
  TbDeviceMobileBolt,
  TbDeviceMobileCheck,
  TbDeviceMobileX,
  TbLock,
} from "react-icons/tb";
import ToolTip from "../ui/ToolTip";
function DeviceList() {
  const arrayStatus = [
    { name: "Tất cả", value: null },
    { name: "Hoạt động", value: "ACTIVE" },
    { name: "Đã thu hồi", value: "REVOKED" },
    { name: "Đã xóa toàn bộ", value: "WIPED" },
  ];

  const arrayTrusted = [
    { name: "Tất cả", value: null },
    { name: "Tin cậy", value: "true" },
    { name: "Chưa xác thực", value: "false" },
  ];

  const arrayOnline = [
    { name: "Tất cả", value: null },
    { name: "Online", value: "true" },
    { name: "Offline", value: "false" },
  ];

  const array1 = [
    {
      title: "Tất cả thiết bị",
      number: 12,
      icon1: <TbDeviceMobile size={30} />,
    },
    {
      title: "Thiết bị online",
      number: 4,
      icon1: <TbDeviceMobileBolt size={30} />,
    },
    {
      title: "Thiết bị chưa xác thực",
      number: 2,
      icon1: <TbDeviceMobileX size={30} />,
    },
    {
      title: "Thiết bị tin cậy",
      number: 6,
      icon1: <TbDeviceMobileCheck size={30} />,
    },
  ];

  const devices = mockDevices;
  const isLoading = false;
  const totalItems = 12;
  const totalPages = 2;
  const currentPage = 1;
  const limit = 12;

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!id && !status) {
      return;
    }
  };

  return (
    <>
      <ListHeader
        title="Thiết bị đăng ký"
        totalItems={totalItems}
        arrayData={array1}
      />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] table-fixed border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="bg-[#E9EDF2] text-left">
              <th className="p-[1rem]">Tài khoản</th>
              <th className="p-[1rem]">Tên thiết bị</th>
              <th className="p-[1rem]">Nền tảng</th>
              <th className="p-[1rem]">
                <FilterDropDownMenu
                  title="Độ tin cậy"
                  array={arrayTrusted}
                  paramName="isTrusted"
                />
              </th>

              <th className="p-[1rem]  ">
                <FilterDropDownMenu
                  title="Online"
                  array={arrayOnline}
                  paramName="isOnline"
                />
              </th>
              <th className="p-[1rem]">Lần dùng cuối</th>
              <th className="p-[1rem]  ">
                <FilterDropDownMenu
                  title="Tình trạng"
                  array={arrayStatus}
                  paramName="status"
                />
              </th>
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
            ) : devices.length > 0 ? (
              devices.map((device) => (
                <tr key={device.deviceId} className="hover:bg-[#f2f3f8]">
                  <td className="p-[1rem]">
                    <div className="flex flex-col gap-2">
                      <p>{device.user.fullName}</p>
                      <p>{device.user.governmentId}</p>
                    </div>
                  </td>

                  <td className="p-[1rem]">{device.deviceName || "-"}</td>

                  <td className="p-[1rem]">
                    {device.platform} {device.osVersion}
                  </td>

                  <td className="p-[1rem] font-semibold">
                    {device.isTrusted ? (
                      <span className="px-2 py-1">Tin cậy</span>
                    ) : (
                      <span className="px-2 py-1"> Chưa xác thực</span>
                    )}
                  </td>

                  <td className="p-[1rem]">
                    {device.isOnline ? (
                      <span className="flex items-center gap-1 text-primary font-medium">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>{" "}
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 font-medium">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>{" "}
                        Offline
                      </span>
                    )}
                  </td>

                  <td className="p-[1rem]">
                    {new Date(device.lastUsedDate).toLocaleString("vi-VN")}
                  </td>

                  <td className="p-[1rem] font-semibold">
                    {device.status === "ACTIVE" && (
                      <span className="px-2 py-1">Hoạt động</span>
                    )}
                    {device.status === "REVOKED" && (
                      <span className="px-2 py-1">Đã thu hồi</span>
                    )}
                    {device.status === "WIPED" && (
                      <span className="px-2 py-1 ">Đã xóa toàn bộ</span>
                    )}
                  </td>

                  <td className="p-[1rem]  ">
                    <div className="flex items-center gap-[15px]">
                      {device.status === "ACTIVE" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(device.deviceId, "REVOKED")
                          }
                        >
                          <div className="relative group">
                            <TbLock size={22} className="text-[#74767d]" />

                            <ToolTip text="Thu hồi thiết bị" />
                          </div>
                        </button>
                      )}

                      {(device.status === "REVOKED" ||
                        device.status === "ACTIVE") && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(device.deviceId, "WIPED")
                          }
                        >
                          <div className="relative group">
                            <LuPaintbrush
                              size={22}
                              className="text-[#d9534f]"
                            />

                            <ToolTip text="Xóa toàn bộ dữ liệu" />
                          </div>
                        </button>
                      )}
                    </div>
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

export default DeviceList;
