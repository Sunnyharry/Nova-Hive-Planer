# Nova Hive Planner 1.2.2

## Bedienung

- **Sichern** oben aktualisiert nur die geöffnete gespeicherte Karte. Bei der ersten Sicherung öffnet sich **Pläne → Meine Karten** zur Namenseingabe. **Als neue Karte** legt eine separate Kopie an.
- **Automatische Sicherungen** enthält lokale Entwürfe und Wiederherstellungspunkte. Wiederherstellen, Browserneustart, JSON-Export und Viewer öffnen ändern keine manuell gesicherte Karte.
- **Viewer öffnen** zeigt den letzten manuell gesicherten Stand. **Sichern und Viewer öffnen** übernimmt ausdrücklich den aktuellen Entwurf. Ein vorhandener Viewer-Link bleibt beim Sichern gleich.
- **Kartendaten importieren** steht unter **Pläne → Dateien und Kartendaten**.
- Eine neue Karte beginnt mit einer Allianz. Das **+** daneben legt eine weitere an; **✎** bearbeitet Name und Farbe für alle Varianten. Entfernen ist nur möglich, wenn die Allianz in sämtlichen Varianten, Spielerlisten und Bausteinen leer ist. Bestehende Zuordnungen bleiben erhalten.
- Füllen und Prüfen verwenden ganze Kartenfelder. Beide Bereiche haben vier Eck- und vier Kantengriffe sowie einen Verschiebegriff. Die Pfeiltasten bewegen einen Griff um ein Feld, Umschalt um fünf. Escape stellt während einer Änderung den vorherigen Bereich wieder her. Die Auswertung folgt nach dem Loslassen.
- Ein Rasterquadrat entspricht genau einem Feld; eine Basis belegt 3 × 3 Felder. Unter fünf Bildpunkten je Feld wird das Raster ausgeblendet.

## Füllen und Prüfen

Abstand 0/1/2 gilt zu Basen, Allianzzentrum, Marshall, festen Gebäudekernen und sämtlichen importierten Blockerfeldern. Dekoration, Notizen, Licht und Raketenanzeigen erzeugen keine Abstände. Geeignete Reihen beginnen an den tatsächlichen Hinderniskanten. Bestehende Objekte werden nicht verschoben. Die Vorschau ist deterministisch; das Erzeugen bleibt ein einzelner Undo-Schritt.

**Schlammrand blockieren aus:** Die gesamte neue Basis bleibt außerhalb des Schlamms und hält den gewählten Abstand ein. **An:** Eine äußere Reihe darf hineinragen und hat Vorrang vor dem Abstand zum Schlamm. Alle berührten Felder müssen in demselben äußeren Streifen der Basis liegen. Gegenüberliegende Kontakte, L-Formen über zwei Reihen und mittige Berührungen sind ausgeschlossen. Ein vollständiger Streifen mit drei Feldern wird bevorzugt. Abstände zu echten Blockern und anderen Basen gelten weiterhin. Importierter Schlamm und manuelle Stadt-/Stronghold-Flächen werden vereinigt.

Autofill überspringt ungeeignete vorhandene Plätze und nennt ihre Anzahl. Manuell platzierte Basen bleiben erhalten. Gelbe Umrisse zeigen Schlammkontakte außerhalb der erlaubten Randreihe. Diese PvP-Regel folgt der vom Nutzer bestätigten Vorgabe.

Die Hive-Prüfung behält alle legalen 3×3-Anker in einer Feldmaske. Im Überblick erscheinen zusammenhängende Bereiche, beim Vergrößern exakte Grundflächen. Positionen nahe der Formation sind kräftiger markiert; Außenflächen bleiben zurückhaltend sichtbar. Alle Positionen sind zusätzlich über eine paginierte Liste erreichbar. Getrennte Hives werden nicht durch ein gemeinsames großes Außenrechteck verbunden. Schlamm und eigene Abstandsflächen sind für die geometrische Feind-Landeprüfung weiterhin bebaubar. Treffer sind alternative Positionen, keine Anzahl gleichzeitig platzierbarer Basen. Weitere Spielregeln werden nicht simuliert; eine global optimale Füllung wird nicht behauptet.

## Speicherung und Migration

Planschema 12 ergänzt Allianzprofile mit stabilen numerischen IDs und die Option `mudEdge`. Workspace-Version 1 bleibt bestehen. Alte Schemas sowie alle 21 Varianten, Zuweisungen, Bausteine und bisherigen Allianz-IDs bleiben lesbar. Die Kartenkoordinaten werden nicht verändert.

IndexedDB ersetzt den einzelnen lokalen Entwurf. Jeder Tab schreibt einen eigenen Zweig mit Karten-ID und Ausgangsversion. Bis zu zehn Zwischenstände je Zweig, ein globales Budget von 50 MB und 30 Tage begrenzen die Historie. Schnelle Änderungen werden zusammengefasst; ein Kartenwechsel sichert den vorherigen Stand. Der alte localStorage-Eintrag wird importiert und als Rückfallebene erhalten. Fehler werden angezeigt. Manuelle Online-Sicherungen bleiben davon unabhängig und lehnen veraltete Revisionen ab.

Die erste Viewer-Freigabe veröffentlicht serverseitig ausschließlich den bereits gespeicherten Inhalt und erhält dessen manuellen Zeitstempel. Ein möglicherweise mitgesendeter Entwurf wird bei dieser Operation ignoriert.

## Technik und Prüfung

Texturdefinitionen, statische Karte, Planobjekte und Bearbeitungsanzeigen liegen in getrennten SVG-Gruppen. Pan/Zoom erneuert die Texturen nicht. Pointer-Ereignisse werden pro Bildschirmframe zusammengefasst. Kameraänderungen lösen keine Speicherung aus.

Lokaler Headless-Chrome-Vergleich mit vollständigem S04-Import: Die synchrone Kartenaktualisierung in Spieloptik sank bei 100 Basen von etwa 62 ms auf etwa 0,4 ms Median. Bei 700 Basen lagen typische Mediane um 1–1,4 ms. Das misst JavaScript/DOM-Arbeit und ist keine garantierte Bildrate. DOM-Identitäten von Texturen, Karte und Planobjekten bleiben während Kamerabewegungen gleich.

Die Tests decken 21-Varianten-Migration, dynamische Allianzen, Blockerabstände 0/1/2, Schlammstreifen und Überlappungen, vollständige Lückenprüfung, Bedienhandler, Sprachen und Export ab. Browserprüfungen verwenden frische Testprofile und ein simuliertes Archiv: echte IndexedDB-Wiederherstellung, Legacy-Migration, Historiengrenzen, Speicherfehler, zwei Tabs, Viewer-/Entwurfstrennung, acht Griffe, Escape, Raster und mobile Darstellung. Service-Tests prüfen zusätzlich echte Handler mit einem R2-Testdouble, Versionskonflikte und Freigabe ohne Entwurfsübernahme.
