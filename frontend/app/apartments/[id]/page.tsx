"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchApartment, type Apartment } from "@/lib/api";

export default function ApartmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchApartment(params.id)
      .then((a) => {
        setApartment(a);
        setActiveImage(0);
      })
      .catch(() => setError("Apartment not found."));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-teal-700 underline">
          Back to listings
        </Link>
      </div>
    );
  }

  if (!apartment) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <Link href="/" className="text-sm text-teal-700 underline">
        &larr; Back to listings
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="relative h-72 w-full overflow-hidden rounded-lg bg-gray-100 md:h-96">
            {apartment.imageUrls.length > 0 ? (
              <Image
                src={apartment.imageUrls[activeImage]}
                alt={apartment.unitName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
            )}
          </div>
          {apartment.imageUrls.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {apartment.imageUrls.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                    i === activeImage ? "border-teal-600" : "border-transparent"
                  }`}
                >
                  <Image src={url} alt={`${apartment.unitName} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{apartment.unitName}</h1>
          <p className="mt-1 text-gray-500">
            {apartment.project} · Unit {apartment.unitNumber}
          </p>
          <p className="mt-3 text-xl font-semibold text-teal-700">
            {apartment.price.toLocaleString()} EGP
          </p>

          <dl className="mt-6 grid grid-cols-3 gap-4 border-y py-4 text-center">
            <div>
              <dt className="text-xs uppercase text-gray-400">Bedrooms</dt>
              <dd className="mt-1 font-medium">{apartment.bedrooms}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-400">Bathrooms</dt>
              <dd className="mt-1 font-medium">{apartment.bathrooms}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-400">Area</dt>
              <dd className="mt-1 font-medium">{apartment.area} m²</dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-gray-500">{apartment.address}</p>
          <p className="mt-4 whitespace-pre-line text-gray-700">{apartment.description}</p>
        </div>
      </div>
    </div>
  );
}
