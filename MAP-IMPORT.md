# Kartenimport und Spieloptik — Version 1.2.2

## Benutzung

1. Season 4 und die gewünschte Layout-Variante auswählen.
2. **Pläne → Dateien und Kartendaten → Kartendaten importieren** öffnen und `S04-map-planner.json` auswählen.
3. Die Zusammenfassung prüfen, Terrain, feste Gebäude und/oder Schlamm auswählen und übernehmen.
4. Neben Layout unter **Darstellung** zwischen Planansicht und Spieloptik wechseln.

Der Import betrifft die aktuelle Variante. Ein erneuter Import ersetzt die gewählten Kategorien. Nicht gewählte Kategorien und eigene Basen, Zentren und sonstige Planungsobjekte bleiben erhalten. Undo/Redo behandelt den Import als einen Schritt. Eine falsche Season wird abgelehnt; Koordinaten werden niemals automatisch verschoben.

Unter **Anzeige** lassen sich die Ebenen, Kartenbeschriftungen und das Raster ausblenden. Ausblenden hebt keine Blockierung auf. Rot gestrichelte Grundflächen zeigen Konflikte, gelbe einen Schlammkontakt außerhalb einer erlaubten äußeren Reihe. Ein Klick auf eine Kartenfläche zeigt die Koordinaten, Feldzahl und Art im bestehenden Inspector. **Kartenebene bearbeiten** erlaubt das gezielte Entfernen einer ausgewählten Fläche unter Aktionen. Eine versehentliche Verschiebung von importiertem Terrain ist nicht möglich. Die ganze Ebene lässt sich unter Anzeige entfernen; die Änderungen sind rückgängig machbar.

**Schlammrand blockieren** erlaubt genau einen äußeren Streifen im Schlamm; dieser hat Vorrang vor dem allgemeinen Abstand. Ohne Haken bleiben neue Basen vollständig außerhalb und halten den gewählten Abstand ein. Die gleiche Regel gilt für Autofill. Details stehen in [RELEASE-1.2.2.md](RELEASE-1.2.2.md). Manuelles Bauen auf Schlamm bleibt erlaubt. Die Suche nach feindlichen freien Landeplätzen behandelt Schlamm ebenfalls als bebaubar.

## Daten und Geometrie

- Unterstützt: unsere Last-War-S04-Exporte mit `schemaVersion` 1.0 und 2.0, 1000 × 1000, unveränderte Quellkoordinaten X/Y 0–999.
- Terrain wird anhand aller `cells` geprüft, nicht anhand seines rechteckigen Außenmaßes. Löcher bleiben frei.
- Schlammrechtecke schließen ihre Grenzfelder ein. Importierte und manuelle Schlammflächen werden vereinigt. Kontakte über mehr als einen äußeren Streifen erzeugen den PvP-Hinweis nach der vom Nutzer bestätigten Regel.
- Der Planer überträgt die Quellkoordinaten über seinen bestehenden Kartenursprung. Es gibt keinen +1-Versatz.
- Die gesamten Grundflächen werden geprüft. Gebäude auf Schlamm blockieren weiterhin.
- Die importierten Flächen verbrauchen keine der 800 planbaren Objektplätze.
- Die Speicherung verwendet kompakte horizontale Feldfolgen. Zwei wiederverwendete Byte-Masken beschleunigen Kollisions- und Schlammprüfung. SVG zeichnet sichtbare Flächen, nicht einzelne DOM-Knoten pro Feld. Texturen und Symbole sind eingebettet und werden innerhalb eines SVG wiederverwendet.

## Speicherung und Freigabe

Planschema 11 führte optionale `worldMap`, `mapStyle` und `mapOptions` ein. Schema 12 ergänzt gemeinsame Allianzprofile und die Schlammrand-Option. Alte Pläne bleiben lesbar. Die 21 Varianten speichern ihre Kartenebene unabhängig. Importierte Konflikte bleiben beim Speichern erhalten, damit Nutzer sie auflösen können. JSON, Browser-Wiederherstellung, Onlinearchiv und der veröffentlichte aktive Viewer-Plan enthalten dieselben Kartendaten. Private Spielerlisten und Bausteine werden wie bisher nicht in den öffentlichen Viewer übernommen.

SVG und PNG verwenden die gewählte Darstellung. Bei einem leeren Plan mit Kartendaten wird die gesamte Welt exportiert; bei geplanten Objekten der Hive-Ausschnitt. Die Einzeldatei `nova-hive-planner.html` enthält auch die Grafiken und lässt sich offline öffnen. `node build-standalone.mjs` baut sie aus `dist` neu.

## Grafik und Grenzen

Die Spieloptik verwendet extrahierte Gras-/Schlammtexturen, Gebäudeillustrationen und Symbole. Seit 1.2.4 kommen aus Originalmodellen erzeugte Bergansichten und eine statische Wasseransicht hinzu. Statuen und Sushi-Restaurants bleiben exakte Farbflächen. Die Grafikzuordnung benötigt keinen erneuten Import vorhandener S04-Karten. Bildmaterial definiert niemals Blockerfelder. Quellen und Darstellungsgrenzen stehen in [MAP-ART.md](MAP-ART.md).

Die extrahierten S04-Daten enthalten 282 Blockflächen mit 25.597 Feldern und 187 Schlammrechtecke mit 48.298 eindeutigen Feldern. Spielerbasen, Allianzzentren, Minen und temporäre Belegungen sind nicht enthalten. Neu ermittelte Gebäude- und Schlammränder müssen weiterhin im Spiel gegengeprüft werden; die Karte erfasst keine zusätzlichen serverseitigen Platzierungsregeln.

## Prüfung

Modelltests prüfen Löcher im Terrain, Randüberlappungen, ausgeblendete Blocker, Schlamm, falsche Season, beschädigte Dateien, Wiederholungsimport, Konflikt-Erhalt beim Speichern, Flächenfüllung und freie Landeplätze. Die vollständigen Quelldaten wurden gegen die Feldzahlen und die Referenz X816/Y734 geprüft. Browsertests prüfen echten Dateiimport, Undo/Redo, JSON-Wiederöffnung, Inspector, sieben Sprachen, PNG und die Einzeldatei. Der Speicherdienst prüft den Roundtrip der Kartenebene im privaten Archiv und im bereinigten öffentlichen Plan.
