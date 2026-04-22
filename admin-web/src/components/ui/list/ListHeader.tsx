import { CirclePlus } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  totalItems: number;
  addLink?: string;
}

function ListHeader({ title, totalItems, addLink }: Props) {
  return (
    <div className="py-[1.3rem] px-[1.2rem] space-y-[20px]">
      <div className="flex justify-between items-center flex-wrap gap-[20px]">
        <h2 className="text-neutral">
          {title} ({totalItems})
        </h2>

        {addLink && (
          <Link
            to={addLink}
            className="bg-primary text-white border-0 cursor-pointer text-[0.9rem] font-medium w-[90px] !flex p-[10px_12px] items-center justify-center gap-[5px]"
          >
            <CirclePlus size={22} /> Thêm
          </Link>
        )}
      </div>
    </div>
  );
}

export default memo(ListHeader);
