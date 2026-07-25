import Image from "next/image";
import Link from "next/link";
import type { Apartment } from "@/lib/api";

export default function ApartmentCard({ apartment }: { apartment: Apartment }) {
  return (
    <Link
      href={`/apartments/${apartment.id}`}
      className="group overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-44 w-full bg-gray-100">
        {apartment.imageUrls.length > 0 ? (
          <Image
            src={apartment.imageUrls[0]}
            alt={apartment.unitName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
        )}
        {apartment.imageUrls.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
            +{apartment.imageUrls.length - 1} photos
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">{apartment.unitName}</h3>
          <span className="whitespace-nowrap text-sm font-medium text-teal-700">
            {apartment.price.toLocaleString()} EGP
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {apartment.project} · Unit {apartment.unitNumber}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {apartment.bedrooms} bd · {apartment.bathrooms} ba · {apartment.area} m²
        </p>
      </div>
    </Link>
  );
}
