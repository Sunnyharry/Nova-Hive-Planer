# Nova Hive Planner 2.0.0 – Kartenatelier

Die Karte bekommt mehr Platz, die Bedienung eine klare Reihenfolge. Bauen, Spieler und Prüfen sind die drei Arbeitsbereiche. Objekteigenschaften erscheinen erst bei einer Auswahl. Warme helle Flächen und Waldgrün sind die neue Grundeinstellung; bereits gespeicherte Farb- und Spracheinstellungen bleiben erhalten.

## Bedienung

- **Pläne:** Meine Karten, bewusstes Sichern, Kopien, vollständige Plandateien, Kartendatenimport und automatische Sicherungen. Die Vorschau einer Sicherung zeigt Zeitpunkt, Karte, Allianz-/Spieler-/Objektzahlen und die ersten 20 Objekte mit Größe und Koordinaten. Erst „Wiederherstellen“ mit Bestätigung lädt sie.
- **Neue Karte:** drei kurze Schritte für Karte, Allianz und Start. Kartendaten und Spielernamen sind optional. Standard ist eine leere Karte mit genau einer Allianz. Abbrechen bewahrt den bisherigen Plan.
- **Bauen:** Basis, Marshall, Zentrum, Beacon und Terrain; weitere Objekte, Bausteine und Gruppen sind aufklappbar. Bereich füllen enthält Abstand, Schlammrand und die bestätigungspflichtige Vorschau.
- **Spieler:** Suche, Import, Platzierung, Prioritäten, Gruppen und Autofill bleiben erhalten. Weitere Allianzen entstehen über „Allianz verwalten“.
- **Prüfen:** Bereich zeichnen, verschieben, skalieren und prüfen. Geprüft werden ausschließlich freie 3×3-Landeflächen; Schlamm und bloße Berührung sind erlaubt. Füllregeln bleiben davon unabhängig.
- **An der Karte:** Planansicht/Spieloptik, Raster und Anzeigeoptionen. Eigenschaften zeigen Objektart, Größe und Mittelpunkt. Kleine Displays öffnen Werkzeuge bei Bedarf.
- **Viewer:** dieselbe Gestaltung, eigene Ansichtsumschaltung, Spielersuche und lokale Raketensimulation. Einstellungen sind zusammengefasst.

## Daten und Kompatibilität

Kein neues Planformat und keine Migration der gespeicherten Karten. Die Geometrie, 21 Season-/Layoutvarianten, Allianz-IDs, Archivschlüssel und Freigabelinks bleiben erhalten. Automatische Entwürfe überschreiben keine manuell gespeicherten Karten. Nur eine ausdrückliche Speicher-/Freigabeaktion schreibt in das Archiv.

Das echte 1×1-Raster, die 3×3-Basen, Originalgrafiken einschließlich HQ 27, Terrainmasken, Mittelpunktkoordinaten und Exportbeschriftungen bleiben unverändert. Bestehende JSON-Dateien bleiben lesbar. Die Angaben zu Season 1/2/3/5/6 als noch in Entwicklung bleiben sichtbar.

## Prüfung und Rückweg

Siehe [Abnahme und Funktionszuordnung](VERIFICATION-2.0.0.md). Die Veröffentlichung umfasst Editor, öffentlichen Viewer, GitHub Pages und Standalone-HTML. Die Editor-Site behält ihre bisherige private Sichtbarkeit.

Die verifizierte Sicherung von 1.2.5 vom 30.09.2026 bleibt unverändert erhalten. Ausgangscommit im GitHub-Spiegel: `eac3476cf5f26c274016f0766adb11905c4e7ff4`. Ein Rücksetzen der App-Quellen benötigt keine Rückmigration von Karten. Browserentwürfe und Online-Archivdaten liegen außerhalb des Projektbackups und sollen beim Rücksetzen erhalten bleiben.
