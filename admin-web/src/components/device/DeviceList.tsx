import { mockDevices } from "../../mocks/mockDevices";
import ListBody from "../ui/list/ListBody";
import ListHeader from "../ui/list/ListHeader";
import InputSearch from "../ui/InputSearch";
import Loading from "../ui/Loading";
import Pagination from "../ui/Pagination";
import Image from "../ui/Image";
import FilterDropDownMenu from "../ui/FilterDropDownMenu";
import { LuPaintbrush } from "react-icons/lu";
import { TbLock } from "react-icons/tb";
import ToolTip from "../ui/ToolTip";
import {
  DEVICE_STATUS_OPTIONS,
  DEVICE_TRUSTED_OPTIONS,
} from "../../constant/filterOptions";
import Button from "../ui/Button";
function DeviceList() {
  const devices = mockDevices;
  const isLoading = false;
  const totalItems = 12;
  const totalPages = 2;
  const currentPage = 1;
  const size = 12;

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!id && !status) {
      return;
    }
  };

  return (
    <>
      <ListHeader title="Thiết bị đăng ký" totalItems={totalItems} />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] table-fixed border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="text-left">
              <th className="p-[1rem]">Tài khoản</th>
              <th className="p-[1rem]">Tên thiết bị</th>
              <th className="p-[1rem]">Nền tảng</th>
              <th className="p-[1rem]">
                <FilterDropDownMenu
                  title="Độ tin cậy"
                  array={DEVICE_TRUSTED_OPTIONS}
                  paramName="isTrusted"
                />
              </th>

              <th className="p-[1rem]">Lần dùng cuối</th>
              <th className="p-[1rem]  ">
                <FilterDropDownMenu
                  title="Tình trạng"
                  array={DEVICE_STATUS_OPTIONS}
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
                    {new Date(device.lastUsedDate).toLocaleString("vi-VN")}
                  </td>

                  <td className="p-[1rem] font-semibold">
                    {device.status === "ACTIVE" && (
                      <span className="px-2 py-1">Hoạt động</span>
                    )}
                    {device.status === "REVOKED" && (
                      <span className="px-2 py-1">Thu hồi</span>
                    )}
                    {device.status === "WIPED" && (
                      <span className="px-2 py-1 ">Xóa từ xa</span>
                    )}
                  </td>

                  <td className="p-[1rem]  ">
                    <div className="flex items-center gap-[15px]">
                      {device.status === "ACTIVE" && (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(device.deviceId, "REVOKED")
                          }
                        >
                          <div className="relative group">
                            <TbLock size={22} className="text-icon-default" />

                            <ToolTip text="Thu hồi" />
                          </div>
                        </Button>
                      )}

                      {(device.status === "REVOKED" ||
                        device.status === "ACTIVE") && (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(device.deviceId, "WIPED")
                          }
                        >
                          <div className="relative group">
                            <LuPaintbrush
                              size={22}
                              className="text-icon-danger"
                            />

                            <ToolTip text="Xóa từ xa" />
                          </div>
                        </Button>
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

export default DeviceList;
