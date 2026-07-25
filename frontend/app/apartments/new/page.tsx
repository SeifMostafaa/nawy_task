"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createApartment } from "@/lib/api";
import ImagesDropField from "@/components/ImagesDropField";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600";

export default function NewApartmentPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    try {
      const apartment = await createApartment({
        unitName: String(form.get("unitName")),
        unitNumber: String(form.get("unitNumber")),
        project: String(form.get("project")),
        price: Number(form.get("price")),
        bedrooms: Number(form.get("bedrooms")),
        bathrooms: Number(form.get("bathrooms")),
        area: Number(form.get("area")),
        address: String(form.get("address")),
        description: String(form.get("description")),
        imageUrls,
      });
      router.push(`/apartments/${apartment.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create apartment");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-semibold">Add apartment</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Unit name" name="unitName" maxLength={100} required />
          <Field label="Unit number" name="unitNumber" maxLength={20} required />
        </div>
        <Field label="Project" name="project" maxLength={100} required />
        <div className="grid grid-cols-3 gap-4">
          <Field label="Price (EGP)" name="price" type="number" min="0" max="1000000000" step="any" required />
          <Field label="Bedrooms" name="bedrooms" type="number" min="0" max="20" required />
          <Field label="Bathrooms" name="bathrooms" type="number" min="0" max="20" required />
        </div>
        <Field label="Area (m²)" name="area" type="number" min="0" max="100000" step="any" required />
        <Field label="Address" name="address" maxLength={255} required />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea name="description" required rows={4} maxLength={2000} className={inputClass} />
        </div>
        <ImagesDropField value={imageUrls} onChange={setImageUrls} onError={setError} />

        <p className="text-xs text-gray-400">
          <span className="text-red-600">*</span> Required field
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save apartment"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input name={name} type={type} required={required} className={inputClass} {...rest} />
    </div>
  );
}
