"use client";

import { ChangeEvent, useState } from "react";
import type { ApartmentFilters, SortOption } from "@/lib/api";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600";

export default function FiltersBar({
  filters,
  onChange,
}: {
  filters: ApartmentFilters;
  onChange: (patch: Partial<ApartmentFilters>) => void;
}) {
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? "");

  function commitPrice() {
    onChange({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-md border bg-white p-3">
      <div className="w-28">
        <label className="mb-1 block text-xs font-medium text-gray-500">Min price</label>
        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          onBlur={commitPrice}
          className={inputClass}
        />
      </div>
      <div className="w-28">
        <label className="mb-1 block text-xs font-medium text-gray-500">Max price</label>
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onBlur={commitPrice}
          className={inputClass}
        />
      </div>
      <div className="w-24">
        <label className="mb-1 block text-xs font-medium text-gray-500">Bedrooms</label>
        <select
          value={filters.bedrooms ?? ""}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onChange({ bedrooms: e.target.value ? Number(e.target.value) : undefined })
          }
          className={inputClass}
        >
          <option value="">Any</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </div>
      <div className="w-24">
        <label className="mb-1 block text-xs font-medium text-gray-500">Bathrooms</label>
        <select
          value={filters.bathrooms ?? ""}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onChange({ bathrooms: e.target.value ? Number(e.target.value) : undefined })
          }
          className={inputClass}
        >
          <option value="">Any</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </div>
      <div className="w-44">
        <label className="mb-1 block text-xs font-medium text-gray-500">Sort by</label>
        <select
          value={filters.sort ?? "newest"}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({ sort: e.target.value as SortOption })}
          className={inputClass}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
