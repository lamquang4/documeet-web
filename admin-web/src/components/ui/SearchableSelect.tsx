import { useState, useRef, useEffect, memo } from "react";
import Input from "./Input";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

type Option = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  options: Option[];
  setKeyword: (val: string) => void;
  isLoading: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  error?: string;
};

function SearchableSelect({
  value,
  onChange,
  onBlur,
  placeholder = "Chọn...",
  options,
  setKeyword,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  error,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const selectedOption = options.find((opt) => opt.value === value);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setKeyword(search);
    }
  }, [search, open, setKeyword]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        if (open) onBlur?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onBlur]);

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage?.();
    }
  };

  return (
    <div className="relative w-full cursor-pointer" ref={containerRef}>
      <div
        onClick={() => {
          setOpen((prev) => !prev);
          setSearch("");
        }}
        className={twMerge(
          "border p-[6px_10px] flex items-center justify-between w-full cursor-pointer transition-colors",
          open ? "border-gray-400" : "border-gray-300",
          error ? "border-red-500" : "focus:border-gray-400",
        )}
      >
        <p>{selectedOption ? selectedOption.label : placeholder}</p>
        <ChevronDown size={18} />
      </div>

      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 shadow-md max-h-60 overflow-y-auto">
          <div>
            <Input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-b border-gray-300 p-[6px_10px] w-full"
              placeholder="Tìm kiếm..."
            />

            <div
              ref={listRef}
              onScroll={handleScroll}
              className="max-h-60 overflow-y-auto"
            >
              {isLoading && <p className="p-[6px_10px]">Đang tải...</p>}

              {!isLoading && options.length === 0 && (
                <p className="p-[6px_10px]">Không tìm thấy</p>
              )}

              {!isLoading &&
                options.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(opt.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="p-[6px_10px] text-[0.9rem] hover:bg-gray-100 cursor-pointer"
                  >
                    {opt.label}
                  </div>
                ))}

              {isFetchingNextPage && (
                <p className="p-[6px_10px]">Đang tải thêm...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default memo(SearchableSelect);
