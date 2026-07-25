import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createApartment, getApartment, listApartments } from "../controllers/apartments";

export const apartmentsRouter = Router();

const createApartmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many apartments created from this IP, please try again later." },
});

apartmentsRouter.get("/", listApartments);
apartmentsRouter.get("/:id", getApartment);
apartmentsRouter.post("/", createApartmentLimiter, createApartment);
