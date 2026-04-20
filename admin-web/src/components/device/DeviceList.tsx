import ListBody from "../ui/list/ListBody";
import ListHeader from "../ui/list/ListHeader";
import InputSearch from "../ui/InputSearch";
import Loading from "../ui/Loading";
import Pagination from "../ui/Pagination";
import Image from "../ui/Image";
import FilterDropDownMenu from "../ui/FilterDropDownMenu";
import { LuPaintbrush } from "react-icons/lu";
import { TbLock, TbLockOpen } from "react-icons/tb";
import ToolTip from "../ui/ToolTip";
import {
  DEVICE_STATUS_OPTIONS,
  DEVICE_TRUSTED_OPTIONS,
} from "../../constant/filterOptions";
import Button from "../ui/Button";
import { useSearchParams } from "react-router-dom";
import {
  useActivateDevice,
  useGetAllDevices,
  useRevokeDevice,
  useWipeDevice,
} from "../../hooks/queries/useDevices";
import type { GetDevicesParams } from "../../apis/deviceApi";
import Swal from "sweetalert2";
function DeviceList() {
  const [searchParams] = useSearchParams();

  // Đọc từ URL
  const params: GetDevicesParams = {
    page: Number(searchParams.get("page") ?? 0),
    size: Number(searchParams.get("size") ?? 12),
    keyword: searchParams.get("keyword") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    isTrusted:
      searchParams.get("isTrusted") === null
        ? undefined
        : searchParams.get("isTrusted") === "true",
  };

  const { data, isLoading } = useGetAllDevices(params);
  const totalItems = data?.data.totalElements ?? 0;
  const totalPages = data?.data.totalPages ?? 0;
  const devices = data?.data.content ?? [];

  const revokeDevice = useRevokeDevice();
  const wipeDevice = useWipeDevice();
  const activateDevice = useActivateDevice();

  const handleUpdateStatus = async (
    id: string,
    status: "ACTIVE" | "REVOKED" | "WIPED",
  ) => {
    if (!id || !status) return;

    const statusConfig: Record<string, { title: string; text: string }> = {
      REVOKED: {
        title: "Xác nhận thu hồi thiết bị?",
        text: "Thiết bị sẽ bị thu hồi và không thể đăng nhập cho đến khi được kích hoạt lại.",
      },
      WIPED: {
        title: "Xác nhận xóa từ xa thiết bị?",
        text: "Toàn bộ dữ liệu trên thiết bị sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.",
      },
      ACTIVE: {
        title: "Xác nhận kích hoạt lại thiết bị?",
        text: "Thiết bị sẽ được kích hoạt và có thể đăng nhập trở lại.",
      },
    };

    const config = statusConfig[status];

    const result = await Swal.fire({
      title: config.title,
      text: config.text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    if (status === "REVOKED") revokeDevice.mutate(id);
    if (status === "WIPED") wipeDevice.mutate(id);
    if (status === "ACTIVE") activateDevice.mutate(id);
  };

  return (
    <>
      <ListHeader title="Thiết bị đăng ký" totalItems={totalItems} />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
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
                            <TbLock size={22} className="text-neutral" />
                            <ToolTip text="Thu hồi thiết bị" />
                          </div>
                        </Button>
                      )}

                      {device.status === "REVOKED" && (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(device.deviceId, "ACTIVE")
                          }
                        >
                          <div className="relative group">
                            <TbLockOpen size={22} className="text-neutral" />
                            <ToolTip text="Kích hoạt lại thiết bị" />
                          </div>
                        </Button>
                      )}

                      {(device.status === "ACTIVE" ||
                        device.status === "REVOKED") && (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(device.deviceId, "WIPED")
                          }
                        >
                          <div className="relative group">
                            <LuPaintbrush size={22} className="text-danger" />
                            <ToolTip text="Xóa từ xa thiết bị" />
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
        currentPage={params.page ?? 0}
        size={params.size ?? 12}
        totalItems={totalItems}
      />
    </>
  );
}

export default DeviceList;
