"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function SearchBar({
  search,
  setSearch,
}: SearchBarProps) {
  return (
    <div className="mx-auto mb-12 max-w-3xl">
      <div className="relative">

        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          placeholder="Search beats..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-full border border-white/10 bg-[#111111] py-4 pl-14 pr-6 text-white outline-none transition focus:border-blue-500"
        />

      </div>
    </div>
  );
}