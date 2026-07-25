export type Apartment = {
  id: string;
  unitName: string;
  unitNumber: string;
  project: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  description: string;
  imageUrls: string[];
  createdAt: string;
};

export type ApartmentListResponse = {
  data: Apartment[];
  total: number;
  page: number;
  limit: number;
};

export type SortOption = "newest" | "price_asc" | "price_desc";

export type ApartmentFilters = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  sort?: SortOption;
  page?: number;
  limit?: number;
};

export type NewApartmentInput = Omit<Apartment, "id" | "createdAt" | "imageUrls"> & {
  imageUrls?: string[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function fetchApartments(
  filters: ApartmentFilters,
  signal?: AbortSignal
): Promise<ApartmentListResponse> {
  const url = new URL("/api/apartments", API_URL);
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });
  const res = await fetch(url, { cache: "no-store", signal });
  if (!res.ok) throw new Error("Failed to load apartments");
  return res.json();
}

export async function fetchApartment(id: string): Promise<Apartment> {
  const res = await fetch(new URL(`/api/apartments/${id}`, API_URL), { cache: "no-store" });
  if (!res.ok) throw new Error("Apartment not found");
  return res.json();
}

export async function createApartment(input: NewApartmentInput): Promise<Apartment> {
  const res = await fetch(new URL("/api/apartments", API_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to create apartment");
  }
  return res.json();
}
