import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
const prisma = new PrismaClient();
const r = Router();
const IngestSchema = z.object({ direction: z.enum(['A','B']), origin: z.string(), destination: z.string(), scheduledDep: z.string().optional(), scheduledArr: z.string().optional(), predictedDep: z.string().optional(), predictedArr: z.string().optional(), actualArr: z.string().optional(), status: z.string(), delayMinutes: z.number().optional(), vehicleId: z.string().optional() });
r.get('/', async (req, res) => { const rows = await prisma.trip.findMany({ orderBy: { lastUpdate: 'desc' }, take: 100 }); res.json(rows); });
r.post('/ingest', async (req, res) => { const parse = IngestSchema.safeParse(req.body); if (!parse.success) return res.status(400).json(parse.error); const t = parse.data; await prisma.trip.create({ data: t }); res.json({ ok: true }); });
export default r;