---
title: Changelog Netlify-Integration + zentrale DB
created: 2026-09-23
---

# Changelog Netlify-Integration + zentrale DB

## Neue/geänderte Dateien (im Zip `hkv-messe-quiz-netlify.zip`)
- `index.html`, `highscore.html`, `admin.html` — v2-Seiten, `ScoreStore` jetzt an echte API angebunden statt localStorage
- `netlify/functions/scores.js` — Bestenliste lesen/schreiben (Netlify Blobs)
- `netlify/functions/played-count.js` — zentraler Spielzähler
- `netlify/functions/admin-login.js`, `admin-clear.js` — Passwortprüfung serverseitig
- `netlify.toml`, `package.json` — Build-/Function-Konfiguration
- `README.md` — Schritt-für-Schritt-Deployment-Anleitung

## Umgesetzt
- Zentrale Bestenliste über Netlify Blobs (kein zusätzlicher DB-Dienst nötig)
- Admin-Passwort aus dem Frontend-Code entfernt, liegt jetzt als Environment-Variable `ADMIN_PASSWORD` in den Netlify-Site-Settings; jede Löschaktion prüft es serverseitig erneut
- Quiz + Bestenliste haben einen localStorage-Fallback bei Verbindungsausfall, ohne dass das die zentrale DB-Logik ersetzt

## Offene Punkte / bewusste Annahmen
- Zähler-Inkrement (`played-count.js`) ist nicht 100% race-condition-frei bei sehr vielen gleichzeitigen Anfragen — für einen Messestand mit wenigen Kiosk-Geräten unproblematisch
- Bestenliste ist über `/api/scores` öffentlich lesbar (keine sensiblen Daten enthalten, daher bewusst kein Passwortschutz auf Lesezugriff)
- ADMIN_PASSWORD muss vor dem ersten Einsatz manuell in den Netlify-Site-Settings gesetzt werden, sonst meldet der Login "Server ist noch nicht konfiguriert"

## Nächste Schritte (Vorschlag)
1. Repo auf Netlify verbinden (Git-Connect oder Netlify CLI) und deployen
2. `ADMIN_PASSWORD` in den Site-Settings setzen
3. Nach Deploy die drei URLs (`/`, `/highscore.html`, `/admin.html`) am Stand testen, inkl. paralleler Geräte
4. Echte Fragen statt Platzhalter in `index.html` eintragen
