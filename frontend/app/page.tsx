"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchApartments, type Apartment, type ApartmentFilters } from "@/lib/api";
import ApartmentCard from "@/components/ApartmentCard";
import SearchBar from "@/components/SearchBar";
import FiltersBar from "@/components/FiltersBar";
import Pagination from "@/components/Pagination";

const LIMIT = 12;

export default function HomePage() {
  const [filters, setFilters] = useState<ApartmentFilters>({ page: 1, limit: LIMIT });
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateFilters = useCallback((patch: Partial<ApartmentFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => updateFilters({ search }), [updateFilters]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchApartments(filters, controller.signal)
      .then((res) => {
        setApartments(res.data);
        setTotal(res.total);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Could not load apartments. Is the API running?");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [filters]);

  return (
    <div>
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="mb-6">
        <FiltersBar filters={filters} onChange={updateFilters} />
      </div>

      {loading && <p className="text-sm text-gray-500">Loading apartments...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && apartments.length === 0 && (
        <p className="text-sm text-gray-500">No apartments found.</p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {apartments.map((apartment) => (
          <ApartmentCard key={apartment.id} apartment={apartment} />
        ))}
      </div>

      <Pagination
        page={filters.page ?? 1}
        limit={LIMIT}
        total={total}
        onPageChange={(page) => updateFilters({ page })}
      />
    </div>
  );
}
