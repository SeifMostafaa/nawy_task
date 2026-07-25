import { z } from "zod";

const imageUrl = z.string().url("Each image must be a valid URL").max(3_000_000);

export const createApartmentSchema = z.object({
  unitName: z.string().trim().min(1, "Unit name is required").max(100),
  unitNumber: z.string().trim().min(1, "Unit number is required").max(20),
  project: z.string().trim().min(1, "Project is required").max(100),
  price: z.number().positive("Price must be greater than 0").max(1_000_000_000),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  area: z.number().positive("Area must be greater than 0").max(100_000),
  address: z.string().trim().min(1, "Address is required").max(255),
  description: z.string().trim().min(1, "Description is required").max(2000),
  imageUrls: z.array(imageUrl).max(6, "Up to 6 images allowed").optional().default([]),
});

export type CreateApartmentInput = z.infer<typeof createApartmentSchema>;

export const listApartmentsQuerySchema = z
  .object({
    search: z.string().trim().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    bedrooms: z.coerce.number().int().nonnegative().optional(),
    bathrooms: z.coerce.number().int().nonnegative().optional(),
    sort: z.enum(["newest", "price_asc", "price_desc"]).optional().default("newest"),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(12),
  })
  .refine((q) => q.minPrice === undefined || q.maxPrice === undefined || q.minPrice <= q.maxPrice, {
    message: "minPrice must not be greater than maxPrice",
    path: ["minPrice"],
  });
