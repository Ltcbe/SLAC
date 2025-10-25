import { Router, type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const r = Router();

const IngestSchema = z.object({
  tripId: z.string().optional(),
  direction: z.enum(["A", "B"]),
  origin: z.string(),
  destination: z.string(),
  scheduledDep: z.string().datetime().optional(),
  scheduledArr: z.string().datetime().optional(),
  predictedDep: z.string().datetime().optional(),
  predictedArr: z.string().datetime().optional(),
  actualArr: z.string().datetime().optional(),
  status: z.enum(["on_time", "delayed", "cancelled", "arrived"]),
  delayMinutes: z.number().int().optional(),
  vehicleId: z.string().optional(),
  stops: z.array(
    z.object({
      seq: z.number().int(),
      station: z.string(),
      schedTime: z.string().datetime().optional(),
      predTime: z.string().datetime().optional(),
      actualTime: z.string().datetime().optional(),
      status: z.string().optional()
    })
  ).optional(),
  events: z.array(
    z.object({
      type: z.enum(["delay", "cancel", "info"]),
      description: z.string().optional(),
      at: z.string().datetime().optional()
    })
  ).optional()
});

r.get("/", async (req: Request, res: Response) => {
  const { direction, archived, minDelay } = req.query as Record<string, string>;
  const where: any = {};
  if (direction === "A" || direction === "B") where.direction = direction;
  if (archived === "true") where.archived = true;
  if (archived === "false") where.archived = false;
  if (minDelay) where.delayMinutes = { gte: Number(minDelay) };

  const rows = await prisma.trip.findMany({
    where,
    orderBy: { lastUpdate: "desc" },
    take: 200
  });
  res.json(rows);
});

r.post("/ingest", async (req: Request, res: Response) => {
  const parse = IngestSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error);

  const payload = parse.data;

  const trip = await prisma.trip.upsert({
    where: { id: payload.tripId ?? `manual_${payload.direction}_${payload.vehicleId ?? ""}` },
    update: {
      predictedDep: payload.predictedDep ? new Date(payload.predictedDep) : null,
      predictedArr: payload.predictedArr ? new Date(payload.predictedArr) : null,
      actualArr: payload.actualArr ? new Date(payload.actualArr) : null,
      status: payload.status,
      delayMinutes: payload.delayMinutes ?? null,
      lastUpdate: new Date()
    },
    create: {
      direction: payload.direction,
      origin: payload.origin,
      destination: payload.destination,
      scheduledDep: payload.scheduledDep ? new Date(payload.scheduledDep) : null,
      scheduledArr: payload.scheduledArr ? new Date(payload.scheduledArr) : null,
      predictedDep: payload.predictedDep ? new Date(payload.predictedDep) : null,
      predictedArr: payload.predictedArr ? new Date(payload.predictedArr) : null,
      actualArr: payload.actualArr ? new Date(payload.actualArr) : null,
      status: payload.status,
      delayMinutes: payload.delayMinutes ?? null,
      vehicleId: payload.vehicleId ?? null
    }
  });

  if (payload.stops?.length) {
    await prisma.stop.deleteMany({ where: { tripId: trip.id } });
    await prisma.stop.createMany({
      data: payload.stops.map(s => ({
        tripId: trip.id,
        seq: s.seq,
        station: s.station,
        schedTime: s.schedTime ? new Date(s.schedTime) : null,
        predTime: s.predTime ? new Date(s.predTime) : null,
        actualTime: s.actualTime ? new Date(s.actualTime) : null,
        status: s.status ?? null
      }))
    });
  }

  if (payload.events?.length) {
    await prisma.event.createMany({
      data: payload.events.map(e => ({
        tripId: trip.id,
        type: e.type,
        description: e.description ?? null,
        at: e.at ? new Date(e.at) : new Date()
      }))
    });
  }

  res.json({ ok: true, tripId: trip.id });
});

export default r;
