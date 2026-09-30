# Abnahme 2.0.0

Ausgangsstand 1.2.5: `eac3476cf5f26c274016f0766adb11905c4e7ff4`. Umsetzung auf `version-2.0`. Backup G00 unverändert. Modell, Koordinaten, Kollisionsprüfung, Renderer und Speicherprotokoll wurden für den Oberflächenumbau weiterverwendet.

## Bestandsfunktionen und neuer Zugang

| Funktion | Zugang im Kartenatelier |
|---|---|
| Neue Karte | Pläne → Neue Karte; kurze Einrichtung |
| Manuell sichern, laden, kopieren, umbenennen, löschen | Pläne → Meine Karten; weitere Kartenaktionen unter Mehr |
| Autosicherung, Wiederherstellung | Pläne → Automatische Sicherungen → Vorschau |
| Archivzugang sichern/importieren | Pläne → Archiv-Zugang |
| Plan-JSON öffnen/speichern, Variante zurücksetzen | Pläne, vorhandene Datei-/Variantenaktionen |
| Terrain-/Gebäude-/Schlamm-JSON | Pläne → Kartendaten importieren; optional in Neuer Karte |
| Season und Layout | Kartenmenü unter dem Plannamen |
| Aktive Allianz, Name/Farbe, neue Allianz | Kontextzeile und Allianz verwalten |
| Basis, Marshall, Zentrum, Beacon, Terrain | Bauen, beschriftete Objektknöpfe |
| Stadt, Stronghold, Notiz, Rakete | Bauen → Weitere Objekte |
| Objektsuche/-baum, Sichtbarkeit, Gruppen | Bauen → Objektübersicht und Suche / Objektgruppen |
| Gespeicherte Bausteine | Bauen → Bausteine |
| Mehrfachauswahl, Auswahlfilter, Navigation | Direkt an der Karte / Bauen → Auswahl und Navigation |
| Name, Größe, Zentrum, Level, Spielerzuweisung | Kontextbezogene Eigenschaften nach Auswahl |
| Sperren, Kopieren, Einfügen, Duplizieren, Löschen, Verbinden, Ausrichten | Eigenschaften → Aktionen; Sperren direkt im Kopf |
| Terrain-/Bereichsgröße | Vorhandene Griffpunkte und numerische Eigenschaften |
| Spielerimport, Suche, Zuweisung | Spieler |
| Prioritäten, Freundesgruppen, Autofill, Sammelaktionen | Spieler → Priority & Gruppen / vorhandene Spieleraktionen |
| L4, Namen, Koordinaten, Notizen, Raketen, Allianzfilter | Anzeige an der Karte |
| 1×1-Raster und Plan-/Spieloptik | Direkt an der Karte |
| Hive-Prüfung, Fundstellen, Prüfbereich | Prüfen |
| Füllbereich, Gap 0/1/2, Schlammrand, Vorschau | Bauen → Bereich füllen |
| Rückgängig/Wiederholen und Tastenkürzel | Kopfzeile und bestehende Tastenkürzel |
| Viewer, bewusst Sichern und teilen, PNG/SVG/CSV | Teilen |
| Sprache, Theme, Hilfe | Einstellungen |
| Viewer-Suche, Zoom, Ansichtswechsel, Raketensimulation | Öffentlicher Viewer; Darstellung nur lokal |

## Automatisierte Prüfung

Alle 27 bestehenden `test/*.test.cjs` bestanden vor dem Umbau (DOM-Test mit Linkedom) und nach dem Umbau. Die DOM-Erwartungen wurden an Bauen/Spieler/Prüfen und 2.0.0 angepasst; Geometrie- und Datenprüfungen bleiben erhalten. Übersetzungsprüfung deckt jetzt auch die Einrichtung und den Viewer ab: 735 Texte mit vollständigen sechs Übersetzungen neben Deutsch. Die normalen Oberflächentexte und primären Aktionen aller vier Themes erreichen mindestens 4,5:1 Kontrast.

Besonders geprüft: 3×3-Belegung, Weltgrenzen, unregelmäßige Terrainkanten, Mittelpunktregeln, verbundene Flächen, Allianzen, Gruppen, Prioritäten, 21 Varianten, alte Schemawerte, JSON-Rundreise, Exportdarstellung und Viewer-Privatsphäre. `landing-contract.test.cjs` verwendet zusätzlich die echte lokale S04-Karte für X865/Y713 und erhält diese Fundstelle auch im größeren Prüfbereich.

`test/browser-v2.cjs` prüft in echtem Chrome die tatsächliche Oberfläche mit isolierter Archiv-Testantwort: Einrichtung vor/zurück/abbrechen, ungültiges JSON ohne Zustandsverlust, neue Allianz und Farbe, manuelles Speichern, getrennten Entwurf, Sicherungsvorschau ohne Laden, Konflikt 409 und Ausfall 503 ohne Datenverlust, alle sieben Sprachen, helle/dunkle Darstellung, Menügrenzen bei 320/360/768/1024/1440 Pixeln, Füllvorschau und Rückgängig als einen Schritt. Viewer-Prüfung: Suche, Spieloptik, Raketentastatursteuerung, Zurücksetzen, Escape und keine Schreibanforderung.

Weitere Browserprüfung: gültige Einrichtung mit zwei Spielern, tatsächliche Basisplatzierung, Auswahl/Eigenschaften schließen, Fadenkreuz beim Zeichnen, Fülloptionen, schmale Ansichten. Der Archivdienst hat eigene Tests mit R2-Testdouble für CRUD, Zugriffstrennung, Konflikte, stabile Links und bereinigte öffentliche Pläne.

Die Tests verändern keine vorhandenen Nutzerkarten. Browsertests verwenden frische Kontexte. Die gesonderte Prüfung am veröffentlichten Dienst verwendet ausschließlich einen neu angelegten Testdatensatz, der anschließend wieder gelöscht wird.

## Geschwindigkeit

Chrome auf demselben PC, 1440×950, vollständige S04-Daten, 102 Objekte, Nacht-Theme. Je 30 abwechselnde Zoomaktionen; Median der synchronen Handler-Laufzeit, keine FPS-Messung:

| Ansicht | Raster | 1.2.5 | 2.0.0 |
|---|---|---:|---:|
| Planansicht | an | 72,9 ms | 58,8 ms |
| Planansicht | aus | 68,6 ms | 57,4 ms |
| Spieloptik | an | 41,4 ms | 34,7 ms |
| Spieloptik | aus | 42,3 ms | 32,3 ms |

Zusätzlicher Vergleich aus dem unveränderten Git-Stand 1.2.5: kleine und 100-Basen-Hives, beide Ansichten, 10 Zooms, 10 Pan-Schritte, Auswahl, Ziehen und 6 Bereichsänderungen. Beim großen Hive benötigten die Zehner-Zoomfolgen 37,0/37,8 ms reine Skriptzeit in 1.2.5 und 34,3/27,8 ms in 2.0.0. Pan-Folgen lagen bei 11,1/10,0 gegenüber 13,0/13,5 ms; kleine Unterschiede liegen im Millisekundenbereich. Auswahl kleiner Hives kann durch das erstmalige Einblenden der Eigenschaften mehr Arbeit auslösen. Kein fortlaufender Aufbau der statischen Ebenen: DOM-Identität während Zoom und Pan-Bewegung geprüft; die Texturdefinitionen bleiben bestehen. Eine gezielte neue Objektauswahl darf deren Hervorhebung erneuern.

Messdateien, Screenshots, S04-Regressionsarbeitsstand und vollständige Testprotokolle liegen lokal im Arbeitsordner `work/`. Ergebnisse sind Vergleichswerte dieses PCs; sie versprechen keine bestimmte Bildrate auf anderen Geräten.

## Bewusste Grenzen

Die Sicherungsvorschau ist eine Text-/Objektvorschau, kein zweiter Karteneditor. Auf kleinen Displays liegt die zeitweise Werkzeugfläche über der Karte und schließt nach Werkzeugwahl. Online-Sichern braucht weiterhin eine Verbindung; die lokale Bearbeitung und Dateiexporte funktionieren ohne Archivdienst. Vorhandene Sprach-/Theme-Wahl wird respektiert, deshalb startet ein bestehender Browser nicht zwingend in der neuen hellen Grundeinstellung.


## Veröffentlichung erfolgreich

Am 30.09.2026 veröffentlicht: [Editor](https://nova-hive-planner.georgiadis-c.chatgpt.site), [Viewer-Dienst](https://nova-hive-viewer.georgiadis-c.chatgpt.site), [GitHub Pages](https://sunnyharry.github.io/Nova-Hive-Planer/dist/index.html). Editor weiterhin privat, Viewer und GitHub unverändert öffentlich. Bestehende Viewer-Links bleiben gültig.

Live-Prüfung um 00:41 UTC: neuen isolierten Datensatz manuell gesichert, alle 21 Varianten geladen, Unveröffentlichtes nicht anonym lesbar, bewusst veröffentlicht, öffentliche Spielerinformationen bereinigt, erneutes Sichern unter derselben Viewer-ID sichtbar, veraltete Version mit 409 abgelehnt. Testdatensatz anschließend gelöscht und Viewer-Zugriff wieder 404. Keine vorhandenen Nutzerkarten verändert. GitHub Pages liefert App 2.0.0, Atelier-Modul und Viewer 2.0.0 jeweils mit HTTP 200.

Standalone zusätzlich in echtem Chrome geprüft: geführter Import der vollständigen S04-Datei mit 282 Objektflächen und 187 Schlammflächen, genau einer Allianz, 21 Varianten, korrekter X865/Y713-Prüfung und tatsächlichem SVG-Download. Der Produktions-Snapshot und die Standalone-Datei liegen lokal unter `outputs/Releases/Nova-Hive-Planer-2.0.0/`; Manifest und ZIP-Inhalte sind hash-/CRC-geprüft. Die SHA-256 des 1.2.5-Backups wurde nach Abschluss erneut unverändert bestätigt.
