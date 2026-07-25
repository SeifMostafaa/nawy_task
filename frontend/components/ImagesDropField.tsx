"use client";

import { ChangeEvent, DragEvent, useState } from "react";

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_IMAGES = 6;

export default function ImagesDropField({
  value,
  onChange,
  onError,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  onError: (message: string) => void;
}) {
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - value.length;
    if (remaining <= 0) {
      onError(`You can add up to ${MAX_IMAGES} images.`);
      return;
    }

    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        if (!file.type.startsWith("image/")) {
          onError("Please drop image files only.");
          return;
        }
        if (file.size > MAX_BYTES) {
          onError("Each image must be smaller than 2MB.");
          return;
        }
        const reader = new FileReader();
        reader.onload = () => onChange([...value, reader.result as string]);
        reader.readAsDataURL(file);
      });
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Images (optional, up to {MAX_IMAGES})
      </label>

      {value.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative h-20 overflow-hidden rounded-md border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 rounded-full bg-white/90 px-1.5 py-0.5 text-xs font-medium shadow hover:bg-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length < MAX_IMAGES && (
        <div
          onDragOver={(e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex h-24 items-center justify-center rounded-md border-2 border-dashed text-sm transition ${
            dragging ? "border-teal-600 bg-teal-50" : "border-gray-300"
          }`}
        >
          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center text-gray-500">
            <span>
              <span className="text-teal-700 underline">Choose images</span> or drag them here
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
            />
          </label>
        </div>
      )}
    </div>
  );
}
