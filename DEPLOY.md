# HKV Messe-Quiz — Netlify-Deployment mit zentraler DB

Diese Version speichert die Bestenliste **nicht mehr in localStorage**,
sondern zentral über **Netlify Functions** + **Netlify Blobs**. Alle
Kiosk-Geräte am Stand sehen damit dieselbe Bestenliste.

## Ordnerstruktur

```
/
├── index.html                  ← Quiz (Jugendliche/Erwachsener-Auswahl + Fragen)
├── highscore.html               ← Bestenliste (Auto-Refresh 60s)
├── admin.html                   ← Admin (Export/Löschen, passwortgeschützt)
├── hkv-logo-nordwest_neg-4x.png ← HKV-Logo (lokal eingebunden)
├── netlify.toml                 ← Build-/Redirect-Konfiguration
├── package.json                 ← Dependency @netlify/blobs
└── netlify/functions/
    ├── scores.js                 GET/POST Bestenliste
    ├── played-count.js           GET/POST Spielzähler
    ├── admin-login.js            Passwort-Check (Login)
    └── admin-clear.js            Bestenliste leeren (Passwort-geschützt)
```

## 1. Deployment einrichten

Am einfachsten über ein Git-Repository (GitHub/GitLab/Bitbucket), weil
Netlify dann automatisch baut, sobald sich Code ändert:

1. Diesen Ordner in ein neues Git-Repo pushen.
2. Auf [app.netlify.com](https://app.netlify.com) → **Add new site → Import
   an existing project** → Repo auswählen.
3. Build-Einstellungen: **Build command leer lassen**, **Publish
   directory: `.`** (steht bereits in `netlify.toml`). Netlify erkennt
   `netlify/functions` automatisch als Functions-Verzeichnis.
4. Deploy starten.

Alternative ohne Git: **Netlify CLI**
```bash
npm install -g netlify-cli
cd hkv-quiz
netlify login
netlify init          # neue Site anlegen
netlify deploy --prod # live deployen
```
(Reines Drag&Drop im Dashboard funktioniert **nicht**, weil das keine
Functions mitnimmt — es braucht immer CLI oder Git-Connect.)

## 2. Admin-Passwort setzen

Das Passwort steht **nicht mehr im Code**. Es muss als
Environment-Variable in Netlify gesetzt werden:

1. Netlify-Dashboard → Site → **Site configuration → Environment
   variables → Add a variable**
2. Key: `ADMIN_PASSWORD`
3. Value: euer gewünschtes Passwort (z.B. `hkv-messe-2026`)
4. Nach dem Setzen einmal **neu deployen** (Environment-Variablen wirken
   erst ab dem nächsten Build/Deploy).

Ohne gesetzte Variable meldet `admin.html` beim Login-Versuch
„Server ist noch nicht konfiguriert“.

## 3. Netlify Blobs

Netlify Blobs ist ab Kontoerstellung automatisch aktiv, es braucht
**keine zusätzliche Einrichtung** — die Functions rufen einfach
`getStore("messequiz")` auf und Netlify verbindet das automatisch mit
der aktuellen Site. Kein Supabase/Firebase/externer Account nötig.

Gespeicherte Keys im Store `messequiz`:
- `scores_jugendliche`, `scores_erwachsener` — je eine JSON-Liste mit Einträgen
- `count_jugendliche`, `count_erwachsener` — Zähler „wie oft gespielt“

**Achtung beim Umstieg von v3 auf v4:** Der Gruppen-Schlüssel wurde von
`kind` auf `jugendliche` umbenannt. Falls in v3 bereits testweise
Runden gespielt wurden, liegen deren Daten unter `scores_kind` /
`count_kind` und werden von v4 nicht mehr gelesen. Vor dem Event bei
Bedarf im Netlify-Blobs-Dashboard oder über den Admin-Bereich prüfen.

## 4. Testen nach dem Deploy

- `https://EURE-SITE.netlify.app/` → Quiz spielen, am Ende erscheint
  Punktzahl, Zeit und Platzierung.
- `https://EURE-SITE.netlify.app/highscore.html` → zentrale
  Bestenliste, aktualisiert sich alle 60s automatisch, auf einem
  zweiten Gerät/Tab sofort sichtbar nach Refresh.
- `https://EURE-SITE.netlify.app/admin.html` → Passwort eingeben,
  CSV-Export prüfen, Bestenliste testweise leeren.

Schnell-Check der API direkt im Browser oder mit curl:
```bash
curl "https://EURE-SITE.netlify.app/api/scores?group=jugendliche"
curl "https://EURE-SITE.netlify.app/api/played-count?group=jugendliche"
```

## 5. Offline-Verhalten am Stand

Falls die Internetverbindung am Kiosk kurz ausfällt, fällt `index.html`
und `highscore.html` automatisch auf einen lokalen `localStorage`-Stand
zurück, damit das Quiz weiterläuft — sobald die Verbindung wieder da
ist, greifen die nächsten Aufrufe wieder auf die zentrale DB zu. Das ist
ein reiner Fallback, kein Sync-Mechanismus: rein lokal gespielte Runden
während eines Ausfalls landen nicht automatisch nachträglich in der
zentralen Bestenliste.

## 6. Fragen

Die finalen Fragen sind bereits eingetragen — oben im `<script>`-Block
von `index.html` im Objekt `QUESTIONS` (getrennt nach `jugendliche` und
`erwachsener`), übernommen aus `Fragen/Quiz_Jugendliche.docx` und
`Fragen/Qiuz Fragen Erwachsene.docx`. Sollen die Fragen später
geändert werden, direkt dort anpassen — an der DB-Anbindung ändert sich
dadurch nichts.

## 7. CI-Farben & Logo

Farben sind als CSS-Variablen im `:root` jeder Datei hinterlegt
(Näherungswert, bei Bedarf mit offiziellem HKV-Styleguide abgleichen).
Das Logo wird ab v4 lokal aus `hkv-logo-nordwest_neg-4x.png` (im
gleichen Ordner) eingebunden statt per externer URL — dieses File muss
beim Deployment mitgenommen werden.
