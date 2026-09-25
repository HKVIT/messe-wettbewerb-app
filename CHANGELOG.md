---
title: Changelog v4 — echte Fragen, Jugendliche statt Kind, eigenes Logo
created: 2026-09-25
---

# Changelog v4

## Neu gegenüber v3
- Platzhalterfragen entfernt und durch die finalen Fragen aus `Fragen/Quiz_Jugendliche.docx` und `Fragen/Qiuz Fragen Erwachsene.docx` ersetzt (je 6 Fragen, 4 Antwortoptionen, dynamische Reihenfolge wie bisher).
- Kategorie "Kind" auf der Startseite, in der Bestenliste, im Admin-Bereich und im Backend (Netlify Functions) in **"Jugendliche"** umbenannt (Gruppen-Schlüssel: `kind` → `jugendliche`).
- HKV-Logo wird jetzt lokal aus der Datei `hkv-logo-nordwest_neg-4x.png` eingebunden statt über die externe URL `hkvnordwest.ch` (robuster, unabhängig von der Live-Website; Fallback-Text bleibt als zusätzliches Netz erhalten).
- localStorage-Präfix für den Offline-Fallback von `messequiz_v2_` auf `messequiz_v4_` erhöht, damit keine alten Testdaten unter dem falschen Gruppennamen "kind" hängen bleiben.

## Betroffene Dateien
- `index.html` — Fragen, Gruppenname, Logo, Storage-Präfix
- `highscore.html` — Tab "Kinder" → "Jugendliche", Gruppenname, Logo, Storage-Präfix
- `admin.html` — Kategorie-Block "Kind" → "Jugendliche", Gruppenname, generische ID-Ableitung
- `netlify/functions/scores.js`, `played-count.js`, `admin-clear.js` — `GROUPS`-Liste von `["kind","erwachsener"]` auf `["jugendliche","erwachsener"]` angepasst
- `netlify.toml`, `package.json`, `netlify/functions/admin-login.js` — unverändert aus v3 übernommen
- `hkv-logo-nordwest_neg-4x.png` — vom Nutzer abgelegtes Logo, neu Teil des Deploy-Ordners

## Wichtig für den Go-Live
- Da sich der Gruppen-Schlüssel geändert hat (`kind` → `jugendliche`), sind etwaige bereits in Netlify Blobs gespeicherte Testdaten unter `scores_kind` / `count_kind` aus v3 **nicht** automatisch sichtbar. Für einen sauberen Start vor dem Event einmal über den Admin-Bereich (oder Netlify-Blobs-Dashboard) prüfen/bereinigen.
- Restliche offene Punkte aus v3 (Netlify verbinden, `ADMIN_PASSWORD` setzen, CI-Farben ggf. abgleichen) sind weiterhin offen — siehe `DEPLOY.md`.

## Offene Punkte / bewusste Annahmen
- Emoji/Choice-Icon für "Jugendliche" auf 🎓 geändert (vorher 🧒 für "Kind"), Hinweistext an die Zielgruppe (Bewerbung/Lehre) angepasst.
- Die Slang-Formulierungen der Jugendlichen-Fragen (Cap, sus, slay, cringe, Aura, lost) wurden 1:1 aus dem Word-Dokument übernommen.
