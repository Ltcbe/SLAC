import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import tripsRouter from "./routes/trips.js";

const app = express();
const prisma = new PrismaClient();

const PORT = Number(process.env.PORT || 8080);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(",") }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/trips", tripsRouter);

// Archivage simple: à adapter avec une vraie condition temps si besoin
setInterval(async () => {
  await prisma.trip.updateMany({
    where: { archived: false, actualArr: { not: null } } as any,
    data: { archived: true }
  });
}, 120000);

app.listen(PORT, () => {
  console.log(`Backend listening on :${PORT}`);
});
