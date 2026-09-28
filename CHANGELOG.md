---
title: Changelog v5 — Quiz abbrechen, grösseres Logo
created: 2026-09-28
---

# Changelog v5

## Neu gegenüber v4
- Neuer Button "Abbrechen" oben rechts im Quiz-Bildschirm (neben dem Timer). Ein Abbruch beendet die laufende Runde sofort und führt zurück zur Kategorie-Auswahl — es wird **kein** Score-Eintrag gespeichert und der Spielzähler ("Bisher gespielt") wird **nicht** erhöht. Die Runde zählt also nicht mit.
- HKV-Logo oben links deutlich grösser dargestellt (`index.html` und `highscore.html`), Fallback-Text-Grösse passend mitskaliert.
- `highscore.html`: oberer Innenabstand leicht vergrössert, damit das grössere Logo den Seitentitel nicht überlappt.
- localStorage-Präfix für den Offline-Fallback von `messequiz_v4_` auf `messequiz_v5_` erhöht (wie bei früheren Versionssprüngen, damit keine alten Teststände durcheinandergeraten).

## Betroffene Dateien
- `index.html` — neuer Abbrechen-Button (Markup, CSS, `abortQuiz()`-Funktion, Wiring), Logo-Grösse, Storage-Präfix
- `highscore.html` — Logo-Grösse, oberer Innenabstand, Storage-Präfix
- `admin.html` — unverändert aus v4 übernommen
- `netlify/functions/*.js`, `netlify.toml`, `package.json`, `hkv-logo-nordwest_neg-4x.png` — unverändert aus v4 übernommen

## Herkunft der Anpassungen
Die beiden Punkte stammen aus `01_Anpassungen/Anpassungen Wettbewerb App.md` (Eintrag vom 2026-09-28):
- "Ein Quiz soll abgebrochen und nicht gezählt werden können. Oben rechts soll ein Button sein, damit die Runde abgebrochen werden kann." → umgesetzt.
- "Das Logo link ist grösser darzustellen, die Datei sollte dies zulassen?" → umgesetzt; die vorhandene PNG-Datei (`hkv-logo-nordwest_neg-4x.png`, 4x-Auflösung) liefert genug Pixel für die grössere Darstellung, ohne unscharf zu wirken.

## Offene Punkte / bewusste Annahmen
- Der Abbrechen-Button ist nur während der Quiz-Fragen sichtbar (nicht auf Start- oder Ergebnis-Bildschirm) — ein Abbruch nach der letzten Frage ist ohnehin nicht mehr nötig, da dann automatisch das Ergebnis gezeigt wird.
- Kein Bestätigungsdialog beim Abbrechen (bewusst, für schnelle Kiosk-Bedienung); bei Bedarf könnte hier ein "Wirklich abbrechen?"-Zwischenschritt ergänzt werden.
- Restliche offene Punkte aus v4/v3 (Netlify verbinden, `ADMIN_PASSWORD` setzen, CI-Farben ggf. abgleichen) sind weiterhin offen — siehe `DEPLOY.md`.
