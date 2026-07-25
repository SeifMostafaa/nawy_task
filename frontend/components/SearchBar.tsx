"use client";

import { useEffect, useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (value: string) => void }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timeout);
  }, [value, onSearch]);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search by unit name, unit number, or project..."
      className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
    />
  );
}
