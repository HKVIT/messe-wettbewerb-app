// netlify/functions/scores.js
// Zentrale Bestenliste ueber Netlify Blobs (statt localStorage).
// GET  /api/scores?group=jugendliche|erwachsener        -> Liste zurueckgeben
// POST /api/scores?group=jugendliche|erwachsener        -> { entry } anhaengen, sortiert zurueckgeben

import { getStore } from "@netlify/blobs";

const GROUPS = ["jugendliche", "erwachsener"];
const MAX_ENTRIES = 200;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

export default async (req) => {
  const url = new URL(req.url);
  const group = url.searchParams.get("group");

  if (!GROUPS.includes(group)) {
    return json({ error: "invalid group" }, 400);
  }

  const store = getStore("messequiz");
  const key = `scores_${group}`;

  if (req.method === "GET") {
    const list = (await store.get(key, { type: "json" })) || [];
    return json(list);
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return json({ error: "invalid json" }, 400);
    }
    const entry = body && body.entry;
    if (!entry || typeof entry.timeMs !== "number") {
      return json({ error: "invalid entry" }, 400);
    }

    // einfache Server-seitige Absicherung der Felder
    const safeEntry = {
      player: Number(entry.player) || 0,
      group,
      score: Number(entry.score) || 0,
      total: Number(entry.total) || 0,
      timeMs: Math.round(Number(entry.timeMs)) || 0,
      ts: new Date().toISOString()
    };

    const list = (await store.get(key, { type: "json" })) || [];
    list.push(safeEntry);
    list.sort((a, b) => (b.score - a.score) || (a.timeMs - b.timeMs));
    const trimmed = list.slice(0, MAX_ENTRIES);

    await store.setJSON(key, trimmed);

    const rank = trimmed.findIndex(
      (e) => e.ts === safeEntry.ts && e.player === safeEntry.player
    ) + 1;

    return json({ list: trimmed, rank, entry: safeEntry });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/.netlify/functions/scores" };
