import { memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "./Button";
import Select from "./Select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  totalPages: number;
  currentPage: number; // backend (0-based)
  size: number;
  totalItems: number;
}

function Pagination({ totalPages, currentPage, size, totalItems }: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // UI page (1-based)
  const displayPage = currentPage + 1;

  const start = totalItems === 0 ? 0 : currentPage * size + 1;
  const end = Math.min((currentPage + 1) * size, totalItems);

  const goToPage = (uiPage: number) => {
    const safeUiPage = Math.max(1, Math.min(uiPage, totalPages));
    const apiPage = safeUiPage - 1;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", apiPage.toString());
    params.set("size", size.toString());

    navigate(`?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (displayPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (displayPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          displayPage - 1,
          displayPage,
          displayPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("size", newSize.toString());
    params.set("page", "0");

    navigate(`?${params.toString()}`);
  };

  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-center bg-white px-[15px] py-3 w-full flex-wrap gap-5 sm:gap-3 text-[0.9rem] font-medium">
      <div className="flex gap-2 items-center">
        Số dòng mỗi trang
        <Select
          value={size}
          onChange={handleSizeChange}
          className="p-1 border border-gray-300 focus:border-black"
        >
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="36">36</option>
          <option value="48">48</option>
        </Select>
      </div>

      <div>
        <p>
          {start}-{end} của {totalItems}
        </p>
      </div>

      <nav className="isolate inline-flex gap-0.5" aria-label="Pagination">
        <Button
          className="h-8.5 w-8.5 flex justify-center items-center border border-gray-300 hover:bg-gray-100"
          disabled={displayPage <= 1}
          onClick={() => goToPage(displayPage - 1)}
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </Button>

        {/* Pages */}
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <Button
                key={`ellipsis-${index}`}
                disabled
                className="h-8.5 w-8.5 flex justify-center items-center border border-gray-300"
              >
                ...
              </Button>
            );
          }

          const uiPage = page as number;

          return (
            <Button
              key={uiPage}
              onClick={() => goToPage(uiPage)}
              className={`h-8.5 w-8.5 flex justify-center items-center border border-gray-300 font-medium ${
                displayPage === uiPage
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {uiPage}
            </Button>
          );
        })}

        {/* Next */}
        <Button
          className="h-8.5 w-8.5 flex justify-center items-center border border-gray-300 hover:bg-gray-100"
          disabled={displayPage >= totalPages}
          onClick={() => goToPage(displayPage + 1)}
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </Button>
      </nav>
    </div>
  );
}

export default memo(Pagination);
