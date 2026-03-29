import { useState, useRef, useEffect, memo } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

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
};

function MultiSearchableSelect({
  value,
  onChange,
  placeholder = "Chọn...",
  options,
  setKeyword,
  isLoading,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  // Tìm kiếm
  useEffect(() => {
    if (!open) return;

    const debounce = setTimeout(() => {
      setKeyword(search);
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, open, setKeyword]);

  // click bên ngoài
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

  const handleSelect = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <div className="cursor-pointer relative w-full" ref={containerRef}>
      <div
        onClick={() => {
          setOpen((prev) => !prev);
          setSearch("");
        }}
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
                className="flex items-center gap-1 bg-gray-200 px-2 py-[2px] text-[0.8rem] rounded hover:bg-gray-300 transition"
              >
                {opt.label}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-gray-400">{placeholder}</span>
            <MdKeyboardArrowDown size={18} />
          </div>
        )}
      </div>

      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 shadow-md rounded max-h-60 overflow-y-auto">
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
            options.map((opt) => {
              const isSelected = value.includes(opt.value);

              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="flex items-center gap-2 p-[6px_10px] text-[0.9rem] hover:bg-gray-100 cursor-pointer"
                >
                  <input type="checkbox" checked={isSelected} readOnly />
                  <span>{opt.label}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default memo(MultiSearchableSelect);
