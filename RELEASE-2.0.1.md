# Nova Hive Planner 2.0.1

- Die Spieloptik zeigt das Allianzzentrum mit der originalen S04-Stromturm-Grafik. Editor, Viewer und Bildexport verwenden dieselbe eingebettete Grafik. Beschriftungen und die 9×9-Gebäudefläche bleiben erhalten.
- Allianzzentrum auswählen → **Eigenschaften → Stromaufladebereich anzeigen (41 × 41)**. Der Bereich ist um das mittlere Feld zentriert: 20 Felder in jede Richtung plus Mittelfeld. Am Weltkartenrand wird die Anzeige abgeschnitten.
- Der Schalter gilt je Allianzzentrum und wird mit dem Plan gespeichert, im Viewer angezeigt und beim Export berücksichtigt. Alte Pläne starten mit ausgeblendeter Reichweite. Beacon-Lichtanzeige, Kollisionen, Füllen und Hive-Prüfung bleiben unabhängig davon.

Die JSON-Schemaversion bleibt unverändert; es kommt nur das optionale boolesche Objektfeld `showRecharge` am Zentrum hinzu.
