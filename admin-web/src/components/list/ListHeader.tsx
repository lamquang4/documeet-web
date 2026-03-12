import { memo, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import StaticCard from "../ui/StaticCard";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

interface Props {
  title: string;
  totalItems: number;
  addLink?: string;
  showDateFilter?: boolean;
  arrayData?: {
    title: string;
    number: number | string;
    icon1?: React.ReactNode;
  }[];
}

function ListHeader({
  title,
  totalItems,
  addLink,
  showDateFilter = false,
  arrayData,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);

    if (date && endDate && endDate < date) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);

    if (date && startDate && startDate > date) {
      setStartDate(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (startDate) params.set("start", dayjs(startDate).toISOString());
    else params.delete("start");

    if (endDate) params.set("end", dayjs(endDate).toISOString());
    else params.delete("end");

    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="py-[1.3rem] px-[1.2rem] bg-[#f1f4f9] space-y-[20px]">
      <div className="flex justify-between items-center flex-wrap gap-[20px]">
        <h2 className="text-[#74767d]">
          {title} ({totalItems})
        </h2>

        {addLink && (
          <Link
            to={addLink}
            className="bg-primary text-white border-0 cursor-pointer text-[0.9rem] font-medium w-[90px] !flex p-[10px_12px] items-center justify-center gap-[5px]"
          >
            <IoMdAddCircle size={22} /> Thêm
          </Link>
        )}
      </div>

      {arrayData && <StaticCard array={arrayData || []} />}

      {showDateFilter && (
        <form
          onSubmit={handleSubmit}
          className="flex gap-[15px] flex-wrap items-end"
        >
          <div className="flex gap-1.5 items-center">
            <label className="text-[0.9rem] font-medium">Từ:</label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              dateFormat="dd/MM/yyyy - HH-mm"
              placeholderText="Chọn ngày giờ"
              className="bg-gray-50 border border-gray-300 text-[0.9rem] p-[6px_10px] outline-none focus:border-gray-400"
            />
          </div>

          <div className="flex gap-1.5 items-center">
            <label className="text-[0.9rem] font-medium">Đến:</label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              dateFormat="dd/MM/yyyy - HH-mm"
              placeholderText="Chọn ngày giờ"
              className="bg-gray-50 border border-gray-300 text-[0.9rem] p-[6px_10px] outline-none focus:border-gray-400"
            />
          </div>

          <button
            type="submit"
            className="p-[6px_12px] text-[0.9rem] bg-primary text-white"
          >
            Tìm kiếm
          </button>
        </form>
      )}
    </div>
  );
}

export default memo(ListHeader);
