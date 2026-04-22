import { memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "./Input";

function InputSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<string>("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("keyword", search.trim());
    } else {
      params.delete("keyword");
    }
    params.set("page", "0");

    navigate(`?${params.toString()}`);
  };

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    setSearch(keyword);
  }, [searchParams]);
  return (
    <form onSubmit={handleSearch}>
      <Input
        type="search"
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-[6px_10px] border border-gray-300 focus:border-gray-400"
      />
    </form>
  );
}

export default memo(InputSearch);
