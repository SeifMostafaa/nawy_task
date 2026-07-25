import cors from "cors";
import express from "express";
import { apartmentsRouter } from "./routes/apartments";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" })); // covers up to 6 base64-encoded images (2MB each) from the frontend

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/apartments", apartmentsRouter);

app.use(errorHandler);
