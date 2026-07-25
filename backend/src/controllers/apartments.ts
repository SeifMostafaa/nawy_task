import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { createApartmentSchema, listApartmentsQuerySchema } from "../validation/apartment";

export async function listApartments(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, minPrice, maxPrice, bedrooms, bathrooms, sort, page, limit } =
      listApartmentsQuerySchema.parse(req.query);

    const where: Prisma.ApartmentWhereInput = {
      ...(search
        ? {
            OR: [
              { unitName: { contains: search, mode: "insensitive" as const } },
              { unitNumber: { contains: search, mode: "insensitive" as const } },
              { project: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? { price: { gte: minPrice, lte: maxPrice } }
        : {}),
      ...(bedrooms !== undefined ? { bedrooms: { gte: bedrooms } } : {}),
      ...(bathrooms !== undefined ? { bathrooms: { gte: bathrooms } } : {}),
    };

    const orderBy: Prisma.ApartmentOrderByWithRelationInput =
      sort === "price_asc" ? { price: "asc" } : sort === "price_desc" ? { price: "desc" } : { createdAt: "desc" };

    const [data, total] = await Promise.all([
      prisma.apartment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.apartment.count({ where }),
    ]);

    res.json({ data, total, page, limit });
  } catch (err) {
    next(err);
  }
}

export async function getApartment(req: Request, res: Response, next: NextFunction) {
  try {
    const apartment = await prisma.apartment.findUnique({ where: { id: req.params.id } });
    if (!apartment) {
      return res.status(404).json({ error: "Apartment not found" });
    }
    res.json(apartment);
  } catch (err) {
    next(err);
  }
}

export async function createApartment(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createApartmentSchema.parse(req.body);
    const apartment = await prisma.apartment.create({ data: input });
    res.status(201).json(apartment);
  } catch (err) {
    next(err);
  }
}
