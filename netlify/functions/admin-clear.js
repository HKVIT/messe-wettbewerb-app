// netlify/functions/admin-clear.js
// Leert die Bestenliste (+ Zaehler) einer Gruppe. Passwort wird bei
// JEDEM Aufruf serverseitig gegen ADMIN_PASSWORD geprueft, damit ein
// blosses "Login" im Browser nicht ausreicht, um Daten zu loeschen.
// POST /api/admin-clear   { group, password }  -> { ok: true }

import { getStore } from "@netlify/blobs";

const GROUPS = ["jugendliche", "erwachsener"];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

export default async (req) => {
  if (req.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return json({ error: "invalid json" }, 400);
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return json({ error: "ADMIN_PASSWORD not configured" }, 500);
  }
  if (body.password !== expected) {
    return json({ error: "unauthorized" }, 401);
  }
  if (!GROUPS.includes(body.group)) {
    return json({ error: "invalid group" }, 400);
  }

  const store = getStore("messequiz");
  await store.delete(`scores_${body.group}`);
  await store.delete(`count_${body.group}`);

  return json({ ok: true });
};

export const config = { path: "/.netlify/functions/admin-clear" };
