import { useState, useRef, useEffect, memo } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

type Option = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: Option[];
  setKeyword: (val: string) => void;
  isLoading: boolean;
};

function SearchableSelect({
  value,
  onChange,
  placeholder = "Chọn...",
  options,
  setKeyword,
  isLoading,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const selectedOption = options.find((opt) => opt.value === value);

  const containerRef = useRef<HTMLDivElement>(null);

  // xử lý setKeyword tìm kiếm gửi backend
  useEffect(() => {
    if (!open) return;

    const debounce = setTimeout(() => {
      setKeyword(search);
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, open, setKeyword]);

  // đóng menu khi bấm ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full cursor-pointer" ref={containerRef}>
      <div
        onClick={() => {
          setOpen((prev) => !prev);
          setSearch("");
        }}
        className={`border p-[6px_10px] flex items-center justify-between w-full ${open ? "border-gray-400" : "border-gray-300"}`}
      >
        <p>{selectedOption ? selectedOption.label : placeholder}</p>
        <MdKeyboardArrowDown size={18} />
      </div>

      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 shadow-md max-h-60 overflow-y-auto">
          <div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-b border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none"
              placeholder="Tìm kiếm..."
            />

            {isLoading && <p className="p-[6px_10px]">Đang tìm...</p>}

            {!isLoading && options.length === 0 && (
              <p className="p-[6px_10px]">Không tìm thấy</p>
            )}

            {!isLoading &&
              options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="p-[6px_10px] text-[0.9rem] hover:bg-gray-100 cursor-pointer"
                >
                  {opt.label}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default memo(SearchableSelect);
