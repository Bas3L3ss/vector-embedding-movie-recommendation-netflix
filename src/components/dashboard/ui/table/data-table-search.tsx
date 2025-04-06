import { Input } from "@/components/ui/input";
import { cn, debounce } from "@/lib/utils";
import { useEffect, useState } from "react";

interface DataTableSearchProps {
  searchKey: string;
  searchQuery: string | null;
  setSearchQuery: (value: string) => void;
}
export function DataTableSearch({
  searchKey,
  searchQuery,
  setSearchQuery,
}: DataTableSearchProps) {
  const [currentQuery, setCurrentQuery] = useState(searchQuery ?? "");
  useEffect(() => {
    // @ts-expect-error: no prob
    debounce(setSearchQuery(currentQuery), 300);
  }, [currentQuery]);
  const handleSearch = (value: string) => {
    setCurrentQuery(value);
  };

  return (
    <Input
      placeholder={`Search ${searchKey}...`}
      value={currentQuery ?? ""}
      onChange={(e) => handleSearch(e.target.value)}
      className={cn("w-full md:max-w-sm text-white")}
    />
  );
}
