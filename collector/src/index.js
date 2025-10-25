import fetch from "node-fetch";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://backend:8080";
const POLL_INTERVAL_SECONDS = Number(process.env.POLL_INTERVAL_SECONDS || "180");

const FROM_A = process.env.FROM_A || "Bruxelles-Central";
const TO_A   = process.env.TO_A   || "Tournai";
const FROM_B = process.env.FROM_B || "Tournai";
const TO_B   = process.env.TO_B   || "Bruxelles-Central";

const IRAIL_BASE = "https://api.irail.be";
const headers = { "User-Agent": "sncb-monitor/1.0" };

async function fetchDepartures(station, to) {
  const url = `${IRAIL_BASE}/liveboard/?station=${encodeURIComponent(station)}&fast=true&format=json`;
  const res = await fetch(url, { headers, timeout: 15000 });
  if (!res.ok) throw new Error(`iRail ${res.status}`);
  const data = await res.json();
  const deps = (data.departures?.departure || []).filter(d => d.direction?.name === to);
  return deps.map(d => ({
    direction: station === FROM_A ? "A" : "B",
    origin: station,
    destination: to,
    scheduledDep: d.time ? new Date(Number(d.time) * 1000).toISOString() : null,
    delayMinutes: d.delay ? Math.round(Number(d.delay) / 60) : 0,
    status: d.canceled === "1" ? "cancelled" : (Number(d.delay) > 0 ? "delayed" : "on_time"),
    vehicleId: d.vehicle || null,
    predictedDep: d.time ? new Date((Number(d.time) + Number(d.delay || 0)) * 1000).toISOString() : null,
    predictedArr: null
  }));
}

async function ingestTrip(t) {
  const url = `${BACKEND_BASE_URL}/api/trips/ingest`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ingest ${res.status}: ${text}`);
  }
}

async function tick() {
  try {
    const [a, b] = await Promise.all([
      fetchDepartures(FROM_A, TO_A),
      fetchDepartures(FROM_B, TO_B)
    ]);
    const trips = [...a, ...b];
    for (const t of trips) {
      await ingestTrip(t);
    }
    console.log(`[collector] pushed ${trips.length} trips`);
  } catch (e) {
    console.error("[collector] error:", e.message);
  }
}

(async () => {
  await tick();
  setInterval(tick, POLL_INTERVAL_SECONDS * 1000);
})();
