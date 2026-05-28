import ListBody from "../ui/list/ListBody";
import ListHeader from "../ui/list/ListHeader";
import InputSearch from "../ui/InputSearch";
import Pagination from "../ui/Pagination";
import { useSearchParams } from "react-router-dom";
import { useGetAllDevices } from "../../hooks/queries/useDevices";
import type { GetDevicesParams } from "../../apis/deviceApi";
import DeviceTable from "./DeviceTable";

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

  return (
    <>
      <ListHeader title="Thiết bị đăng ký" totalItems={totalItems} />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <DeviceTable devices={devices} isLoading={isLoading} />
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
