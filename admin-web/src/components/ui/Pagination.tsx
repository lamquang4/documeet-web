import { memo } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "./Button";
import Select from "./Select";
interface Props {
  totalPages: number;
  currentPage: number;
  size: number;
  totalItems: number;
}
function Pagination({ totalPages, currentPage, size, totalItems }: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const start = (currentPage - 1) * size + 1;
  const end = Math.min(start + size - 1, totalItems);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    params.set("size", size.toString());

    navigate(`?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  const handlesizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newsize = parseInt(e.target.value, 10);
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", newsize.toString());
    params.set("page", "1");
    navigate(`?${params.toString()}`);
  };

  return (
    <>
      {totalItems > 0 && (
        <div className="flex items-center justify-center bg-white px-[15px] py-3 w-full flex-wrap gap-5 sm:gap-3 text-[0.9rem] font-medium">
          <div className="flex gap-2 items-center">
            Số dòng mỗi trang
            <Select
              value={size}
              onChange={handlesizeChange}
              className="p-1 border border-gray-300 focus:border-black text-[0.9rem]"
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

          <div>
            <nav
              className="isolate inline-flex gap-0.5"
              aria-label="Pagination"
            >
              <Button
                type="button"
                className="h-8.5 w-8.5 inline-flex justify-center items-center gap-x-2 text-[0.9rem] border border-gray-300 hover:bg-gray-100"
                aria-label="Previous"
                disabled={currentPage <= 1}
                onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              >
                <GrFormPrevious />
              </Button>

              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <Button
                      type="button"
                      disabled
                      key={`ellipsis-${index}`}
                      className="group h-8.5 w-8.5 flex justify-center items-center   text-[0.9rem] border border-gray-300"
                    >
                      ...
                    </Button>
                  );
                }

                return (
                  <Button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`h-8.5 w-8.5 flex justify-center items-center font-medium text-[0.9rem] border border-gray-300 ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                disabled={currentPage >= totalPages}
                onClick={() =>
                  currentPage < totalPages && goToPage(currentPage + 1)
                }
                className="h-8.5 w-8.5 inline-flex justify-center items-center gap-x-2 text-[0.9rem] border border-gray-300 hover:bg-gray-100"
              >
                <GrFormNext />
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(Pagination);
