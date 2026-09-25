// netlify/functions/admin-login.js
// Prueft das Admin-Passwort SERVERSEITIG gegen die Environment-Variable
// ADMIN_PASSWORD (in den Netlify Site-Settings zu setzen, nicht im Code!).
// POST /api/admin-login   { password }  -> { ok: true|false }

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
    // Env-Variable wurde in den Netlify-Settings noch nicht gesetzt
    return json({ ok: false, error: "ADMIN_PASSWORD not configured" }, 500);
  }

  const ok = typeof body.password === "string" && body.password === expected;
  return json({ ok });
};

export const config = { path: "/.netlify/functions/admin-login" };
