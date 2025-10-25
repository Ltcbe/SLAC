import fetch from 'node-fetch';
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://backend:8080';
const POLL_INTERVAL_SECONDS = Number(process.env.POLL_INTERVAL_SECONDS || '180');
const FROM_A = process.env.FROM_A || 'Bruxelles-Central';
const TO_A = process.env.TO_A || 'Tournai';
const FROM_B = process.env.FROM_B || 'Tournai';
const TO_B = process.env.TO_B || 'Bruxelles-Central';
async function fetchDepartures(station, to){ const url = `https://api.irail.be/liveboard/?station=${encodeURIComponent(station)}&fast=true&format=json`; const res = await fetch(url); if(!res.ok) throw new Error(`HTTP ${res.status}`); const data = await res.json(); return (data.departures?.departure||[]).filter(d=>d.direction?.name===to).map(d=>({ direction: station===FROM_A?'A':'B', origin: station, destination: to, scheduledDep: new Date(Number(d.time)*1000).toISOString(), delayMinutes: d.delay?Math.round(Number(d.delay)/60):0, status: d.canceled==='1'?'cancelled':(Number(d.delay)>0?'delayed':'on_time'), vehicleId: d.vehicle||null })); }
async function ingestTrip(t){ await fetch(`${BACKEND_BASE_URL}/api/trips/ingest`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(t)}); }
async function tick(){ try{ const [a,b]=await Promise.all([fetchDepartures(FROM_A,TO_A),fetchDepartures(FROM_B,TO_B)]); for(const t of [...a,...b]) await ingestTrip(t); console.log('collector push ok'); }catch(e){ console.error('collector error',e.message);} }
await tick(); setInterval(tick,POLL_INTERVAL_SECONDS*1000);