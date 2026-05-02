import { useState, useRef, useEffect, memo } from "react";
import Input from "./Input";
import { ChevronDown } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  options: Option[];
  setKeyword: (val: string) => void;
  isLoading: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

function MultiSearchableSelect({
  value,
  onChange,
  placeholder = "Chọn...",
  options,
  setKeyword,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cachedSelectedOptions, setCachedSelectedOptions] = useState<Option[]>(
    [],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCachedSelectedOptions((prev) => {
      const prevMap = new Map(prev.map((o) => [o.value, o]));
      options.forEach((o) => prevMap.set(o.value, o));
      return Array.from(prevMap.values());
    });
  }, [options]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setSearch("");
    setKeyword("");
  };

  const handleClose = () => {
    setOpen(false);
    setSearch("");
    setKeyword("");
  };

  const handleToggle = () => {
    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setKeyword(val);
  };

  const handleSelect = (val: string) => {
    onChange(
      value.includes(val) ? value.filter((v) => v !== val) : [...value, val],
    );
  };

  const selectedOptions = cachedSelectedOptions.filter((opt) =>
    value.includes(opt.value),
  );

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.();
    }
  };

  return (
    <div className="cursor-pointer relative w-full" ref={containerRef}>
      <div
        onClick={handleToggle}
        className={`border p-[6px_10px] w-full ${open ? "border-gray-400" : "border-gray-300"}`}
      >
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 w-full">
            {selectedOptions.map((opt) => (
              <span
                key={opt.value}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.value);
                }}
                className="flex items-center gap-1 bg-gray-200 px-2 py-[2px] rounded hover:bg-gray-300 transition"
              >
                {opt.label}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-gray-400">{placeholder}</span>
            <ChevronDown size={18} />
          </div>
        )}
      </div>

      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 shadow-md rounded">
          <Input
            autoFocus
            value={search}
            onChange={handleSearchChange}
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
                  onClick={() => handleSelect(opt.value)}
                  className="p-[6px_10px] text-[0.9rem] hover:bg-gray-100 cursor-pointer flex gap-2"
                >
                  <Input
                    type="checkbox"
                    checked={value.includes(opt.value)}
                    readOnly
                  />
                  {opt.label}
                </div>
              ))}

            {isFetchingNextPage && (
              <p className="p-[6px_10px]">Đang tải thêm...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(MultiSearchableSelect);
