// netlify/functions/played-count.js
// Zentraler Zaehler "wie oft gespielt" pro Gruppe, ueber Netlify Blobs.
// GET  /api/played-count?group=jugendliche|erwachsener  -> { count }
// POST /api/played-count?group=jugendliche|erwachsener  -> zaehlt +1 hoch, gibt neue { count } zurueck

import { getStore } from "@netlify/blobs";

const GROUPS = ["jugendliche", "erwachsener"];

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
  const key = `count_${group}`;

  if (req.method === "GET") {
    const n = (await store.get(key, { type: "json" })) || 0;
    return json({ count: n });
  }

  if (req.method === "POST") {
    // Hinweis: kein hartes Locking -> bei sehr vielen gleichzeitigen
    // Anfragen theoretisch nicht 100% race-condition-frei. Fuer einen
    // Messestand mit einem/wenigen Kiosk-Geraeten unproblematisch.
    const current = (await store.get(key, { type: "json" })) || 0;
    const next = current + 1;
    await store.setJSON(key, next);
    return json({ count: next });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/.netlify/functions/played-count" };
