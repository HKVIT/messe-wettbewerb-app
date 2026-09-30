---
title: Changelog v7 — Antwortboxen weiter oben, Kiosk-Vollbild
created: 2026-09-30
---

# Changelog v7

## Neu gegenüber v6
- Quiz-Bildschirm: Die vier Antwortboxen sitzen jetzt mit deutlich mehr Abstand zum unteren Bildschirmrand (zusätzlicher `margin-bottom`, skaliert mit der Bildschirmhöhe). Auf Tablets im Kioskbetrieb waren die Boxen bisher zu nah am Rand.
- Kiosk-Vollbild: Beim Start eines Quiz (Klick auf "Jugendliche", "Erwachsene" oder "Nochmal spielen") wird zusätzlich zur bestehenden Darstellung die Web-Fullscreen-API aufgerufen (`requestFullscreen()`). Auf Chrome für Android blendet das neben der Adressleiste auch die System-Statusleiste (Uhrzeit, Akku, WLAN) und die Navigationsleiste aus, solange die Seite im Vollbildmodus ist — echtes Edge-to-Edge, ohne zusätzliche App.
  - Der Aufruf erfolgt bewusst direkt im Klick-Handler der Start-Buttons, da moderne Browser den ersten Vollbild-Aufruf aus Sicherheitsgründen nur im Rahmen einer echten Nutzerinteraktion zulassen (kein automatischer Aufruf beim Laden möglich).
  - Ein Tap ausserhalb der Seite oder ein System-Swipe (z.B. von unten) kann den Vollbildmodus wieder verlassen — das lässt sich browserseitig nicht verhindern und wird hier bewusst nicht als Fehler behandelt (stiller Fallback, Quiz funktioniert unverändert weiter).
  - Für einen wirklich narrensicheren Kiosk (auch Statusleiste dauerhaft weg, kein versehentliches Verlassen) bleibt zusätzlich die Kombination mit Android-Bildschirmfixierung oder einem dedizierten Kiosk-Browser (z.B. Fully Kiosk Browser) empfehlenswert — das ist Geräte-/OS-Konfiguration, nicht Teil dieser Webapp.
- localStorage-Präfix für den Offline-Fallback von `messequiz_v6_` auf `messequiz_v7_` erhöht (wie bei früheren Versionssprüngen).

## Betroffene Dateien
- `index.html` — Abstand Antwortboxen (CSS), Fullscreen-Aufruf beim Quiz-Start (Script), Storage-Präfix
- `highscore.html` — Storage-Präfix (Konsistenz mit `index.html`, nur für den Offline-Fallback relevant)
- `admin.html` — unverändert aus v6 übernommen
- `netlify/functions/*.js`, `netlify.toml`, `package.json`, `hkv-logo-nordwest_neg-4x.png`, `DEPLOY.md` — unverändert aus v6 übernommen

## Herkunft der Anpassungen
Aus `01_Anpassungen/Anpassungen Wettbewerb App.md`, Abschnitt "Version 7" (Eintrag vom 2026-09-30):
- "Da das Ganze auf Tablets genutzt wird, sollten die Antwortboxen noch mehr nach oben geschoben werden, nicht dass sie in der Nähe des Randes sind." → umgesetzt.

Zusätzlich im Chat besprochen (Kiosk-Vollbild, "Variante 2" aus der Diskussion zu Status-/Navigationsleiste auf Android-Tablets):
- Fullscreen-API beim Start des Quiz einbauen, um Status- und Navigationsleiste während des Spiels auszublenden → umgesetzt.

## Offene Punkte / bewusste Annahmen
- Der Wert für `margin-bottom` unter den Antwortboxen ist eine Schätzung (`clamp(32px, 7vh, 96px)`); der genaue Abstand sollte am echten Tablet am Messestand geprüft und bei Bedarf nachjustiert werden.
- Fullscreen-Verhalten ist browser-/geräteabhängig (funktioniert zuverlässig in Chrome für Android; iOS Safari unterstützt die Fullscreen-API für normale Webseiten nicht — dort bleibt die Darstellung wie bisher, ohne Fehler).
- Kein zusätzlicher Button "Vollbild verlassen"; Verlassen erfolgt weiterhin nur über System-Geste oder automatisch am Ende (Browser-Standardverhalten).
- Restliche offene Punkte aus v3–v6 (Netlify verbinden, `ADMIN_PASSWORD` setzen) sind weiterhin offen.

## Nächste Schritte (Vorschlag)
- v7 auf Netlify deployen und am echten Kiosk-Tablet testen: Abstand der Antwortboxen zum Rand sowie Fullscreen-Verhalten (inkl. Verhalten nach System-Swipe / Bildschirmsperre).
- Falls am Stand zusätzlich Android-Bildschirmfixierung oder ein Kiosk-Browser eingesetzt werden soll, das separat als Geräte-Setup dokumentieren (ausserhalb dieser Webapp).
