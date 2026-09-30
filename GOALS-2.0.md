# Nova Hive Planner Version 2.0 Goals

Stand: 30. September 2026. Ausgangsversion: 1.2.5. Zielrelease: 2.0.0.

Beschlossen ist Kartenatelier als Hauptoberfläche mit einer kurzen geführten Einrichtung für neue Pläne. Die Oberfläche soll ruhiger, natürlicher und einfacher werden. Bestehende Plan-, Karten-, Allianz-, Prüf-, Füll-, Speicher- und Viewer-Funktionen bleiben erhalten.

Der Folgeauftrag „Arbeite alle goals ab“ autorisiert die Umsetzung und Veröffentlichung. G01–G11 sind umgesetzt und geprüft; G12 befindet sich in der Veröffentlichung.

## Status und Reihenfolge

- [x] G00 Bestehenden Stand sichern und Backup prüfen
- [x] G01 Bestandsfunktionen und Umbau vorbereiten
- [x] G02 Ruhige und gut lesbare Gestaltung
- [x] G03 Kartenatelier als neue Hauptoberfläche
- [x] G04 Pläne, Sichern und Import verständlich ordnen
- [x] G05 Neue Pläne geführt einrichten
- [x] G06 Objekte direkt und verständlich bearbeiten
- [x] G07 Allianzen und Spieler einfach verwalten
- [x] G08 Hive prüfen und Bereich füllen klar trennen
- [x] G09 Kartenoptik und Viewer vereinheitlichen
- [x] G10 Kleine Bildschirme und flüssige Bedienung
- [x] G11 Kompatibilität und vollständige Abnahme
- [ ] G12 Version 2.0.0 veröffentlichen und rücksetzbar halten

Die Goals werden in dieser Reihenfolge abgearbeitet. Die Abhängigkeiten erlauben klar getrennte Arbeitspakete; sie sind keine Erlaubnis, neue Chats oder Subagenten zu starten. Ein Goal gilt erst nach seinen Abnahmekriterien als erledigt. Zu jedem Abschluss werden geänderte Dateien, Prüfungen und verbleibende Einschränkungen festgehalten.

## G00 Bestehenden Stand sichern

Status: abgeschlossen. Das Backup wurde vor Anlage dieses Goal-Plans erstellt.

- Backup-Ordner: `C:/Users/Harry/Documents/Codex/2026-09-29/das/outputs/Backups/Nova-Hive-Planer-1.2.5-vor-2.0-20260930-014034`.
- Archiv: `Nova-Hive-Planer-1.2.5-Projektbackup.zip`.
- SHA-256: `bc73f01e8bb3ceb25b4c8867222b6a64d68861e9cb34fffecc340f21d31b32bc`.
- 331 Dateien/Einträge mit Prüfsummen abgeglichen; ZIP-CRC-Prüfung erfolgreich.
- Die drei Git-Historien wurden als vollständige Bundles gesichert und mit `git bundle verify` geprüft.
- GitHub-Spiegel: `eac3476cf5f26c274016f0766adb11905c4e7ff4`.
- Site-Planer: `fcf01562e27fe573d61e7da37afca14da7abfeb8`.
- Viewer-Dienst: `8b88fe3f2999c6787fa3f8dc9a42c422e4237bd9`.

Enthalten sind die vier lokalen Projektstände, Tests, Builds, Standalone-Dateien, lokale Kartendaten und Originalgrafiken mit Herkunftsnachweisen sowie die drei UI-Konzepte. Wiederherstellungshinweise und ein Dateimanifest liegen im Backup. Online-Karten im R2-Archiv, Browser-Entwürfe und private Archivzugangsschlüssel sind nicht Bestandteil dieses lokalen Projektbackups. Vorhandene Daten und Live-Versionen wurden nicht verändert.

## Verbindliche Produktentscheidungen

- Hauptoberfläche: Kartenatelier. Geführter Einstieg nur beim Erstellen eines neuen Plans; alltägliches Arbeiten bleibt frei.
- Linke Bereiche: Bauen, Spieler, Prüfen. Kein dauerhaft leerer rechter Inspector.
- Sichern bleibt eine ausdrücklich ausgelöste Aktion. Automatische Entwürfe und veröffentlichter Viewer-Stand bleiben unterscheidbar.
- Kartendatenimport unter Pläne; im Einrichtungsablauf wird derselbe Import wiederverwendet.
- Neue Pläne starten mit einer Allianz; bestehende Allianzen und Varianten werden vollständig übernommen.
- Originalgrafiken, Planansicht/Spieloptik und lesbare Objektbeschriftungen bleiben erhalten.
- 1000×1000 echte Felder, bestehende Mittelpunktregeln, ganzzahlige Platzierung und präzise Terrainmasken bleiben die fachliche Grundlage.
- Hive prüfen untersucht freie 3×3-Grundflächen unabhängig von Füllabständen und Schlammregeln. Bereich füllen behält seine eigenen Abstands- und Schlammregeln.
- Ein vorhandenes Datenmodell oder Speichersystem wird nicht allein wegen des Oberflächenumbaus ersetzt.
- Zielversion 2.0.0 ist vom Nutzer ausdrücklich gewünscht und hat Vorrang vor der bisherigen reinen Patch-Inkrement-Regel. Der JSON-Schemawert bleibt unabhängig.

## Grenzen der Entwürfe

Die klickbaren UI-Konzepte zeigen Bedienideen mit Beispieldaten. Ihre Platzierung, Koordinatenabbildung, Prüf- und Füllergebnisse sowie Speicher- und Importaktionen sind keine Produktionsimplementierung. Sie dürfen nicht als Ersatz für die bestehenden, getesteten Modelle und Handler übernommen werden.

Designreferenz: `C:/Users/Harry/.codex/visualizations/2026/09/29/01a0eafd-b335-71d0-99e2-8d0a7be584ac/hive-interface-konzepte.html`. Eine unveränderte Kopie liegt im Backup unter `design-reference/`.

## G01 Bestandsfunktionen und Umbau vorbereiten

Status: abgeschlossen. Voraussetzung: G00.

Ergebnis: Eine nachvollziehbare Zuordnung aller vorhandenen Funktionen zur Oberfläche von Version 2.0 und eine sichere Arbeitsgrundlage.

Umfang:

- Version 1.2.5 als unveränderte Vergleichsbasis verwenden; aktuelle Funktionen, Menüpunkte, Tastaturaktionen und Speicherwege inventarisieren.
- Für jede Funktion ihren Platz im Kartenatelier festlegen. Blueprints, Gruppen, Prioritäten, Mehrfachauswahl, Ausrichtung, Notizen, Raketen und Exporte ausdrücklich berücksichtigen.
- Eine eigene Arbeitsbranch für 2.0 anlegen. Modell, Geometrie und Speicherdienst weiterverwenden; UI-Zustand von Plandaten trennen.
- Die ausdrückliche Zielversion 2.0 als Ausnahme von der bisherigen Patch-Versionsregel dokumentieren. Die veröffentlichte App bleibt während der Vorbereitung 1.2.5; Zielrelease ist 2.0.0.

Abnahme:

- [x] Jede Bestandsfunktion hat einen dokumentierten neuen Zugang oder eine ausdrücklich begründete unveränderte Position.
- [x] Repräsentative alte Pläne und ein großer S04-Testplan liegen als Regressionstestfälle vor.
- [x] Funktions- und Performance-Ausgangswerte sind vor dem Umbau erfasst.

Abschlussnachweis: Umsetzung und geprüfte Zugänge in `VERIFICATION-2.0.0.md`; Änderungen in `dist/atelier.js`, `dist/atelier.css`, `dist/app.js`, `dist/i18n.js`, `dist/themes.js`, `dist/index.html` und `viewer/`. 27 Funktionstests, Archivdiensttests, echte Chrome-Abnahme sowie Standalone-/S04-/Exportprüfung erfolgreich. Konkrete Messwerte und bewusste Grenzen sind im Abnahmebericht dokumentiert.

## G02 Ruhige und gut lesbare Gestaltung

Status: abgeschlossen. Voraussetzung: G01.

Ergebnis: Ein zusammenhängendes Designsystem für Kartenatelier, Dialoge und Viewer.

Umfang:

- Warme neutrale Flächen, gut lesbare dunkle Schrift und ein zurückhaltendes Waldgrün für Hauptaktionen einführen; eine passende dunkle Darstellung vorsehen.
- Einheitliche Abstände, Schriftgrößen, Eingabefelder, Schaltflächen, Symbole, Fokus- und Fehlerzustände definieren.
- Allianzfarben für Allianzzuordnung und Warnfarben für konkrete Probleme verwenden; Bedeutung immer auch durch Text oder Symbole ausdrücken.
- Bestehende Sprach- und Theme-Einstellungen kompatibel übernehmen. Alle sieben vorhandenen Sprachen berücksichtigen.

Abnahme:

- [x] Keine unbeschrifteten Hauptaktionen und keine ausschließlich farblich erkennbaren Zustände.
- [x] Normale Texte erfüllen mindestens Kontrast 4,5:1; sichtbarer Tastaturfokus und verständliche deaktivierte Zustände sind vorhanden.
- [x] Helle und dunkle Ansicht bleiben mit den Originalgrafiken, Terrainfarben und mehreren Allianzfarben lesbar.

Abschlussnachweis: Umsetzung und geprüfte Zugänge in `VERIFICATION-2.0.0.md`; Änderungen in `dist/atelier.js`, `dist/atelier.css`, `dist/app.js`, `dist/i18n.js`, `dist/themes.js`, `dist/index.html` und `viewer/`. 27 Funktionstests, Archivdiensttests, echte Chrome-Abnahme sowie Standalone-/S04-/Exportprüfung erfolgreich. Konkrete Messwerte und bewusste Grenzen sind im Abnahmebericht dokumentiert.

## G03 Kartenatelier als neue Hauptoberfläche

Status: abgeschlossen. Voraussetzung: G02.

Ergebnis: Eine große Karte mit einer festen, schlanken Werkzeugleiste und klar geordneten Menüs.

Umfang:

- Kopfzeile auf Pläne, Planname, Speicherstatus, Sichern, Rückgängig/Wiederholen, Teilen und ein kompaktes Einstellungsmenü konzentrieren.
- Die linke Werkzeugleiste in Bauen, Spieler und Prüfen gliedern; jeweils nur den aktiven Aufgabenbereich anzeigen.
- Season, Layout und aktive Allianz kompakt zusammenfassen. Planansicht, Spieloptik und Raster direkt an der Karte anbieten.
- Die permanent leere rechte Seitenleiste entfernen; Objekteigenschaften erst bei Auswahl anzeigen. Seltene Werkzeuge unter Weitere bzw. Erweitert erreichbar halten.

Abnahme:

- [x] Alle Hauptaufgaben sind mit beschrifteten Schaltflächen erreichbar; es stehen keine doppelten Werkzeugleisten nebeneinander.
- [x] Menü-, Sprach- und Ansichtswechsel verändern weder Planinhalt noch Kamera, Auswahl oder offene Eingaben unbeabsichtigt.
- [x] Ohne Auswahl bleibt kein leerer Eigenschaftenbereich stehen; die Karte nutzt die verfügbare Fläche.

Abschlussnachweis: Umsetzung und geprüfte Zugänge in `VERIFICATION-2.0.0.md`; Änderungen in `dist/atelier.js`, `dist/atelier.css`, `dist/app.js`, `dist/i18n.js`, `dist/themes.js`, `dist/index.html` und `viewer/`. 27 Funktionstests, Archivdiensttests, echte Chrome-Abnahme sowie Standalone-/S04-/Exportprüfung erfolgreich. Konkrete Messwerte und bewusste Grenzen sind im Abnahmebericht dokumentiert.

## G04 Pläne, Sichern und Import verständlich ordnen

Status: abgeschlossen. Voraussetzung: G03.

Ergebnis: Manuell gespeicherte Karten, automatische Entwürfe und veröffentlichte Viewer-Stände sind klar unterscheidbar.

Umfang:

- Unter Pläne zuerst Meine Karten zeigen, mit Laden, Sichern, Viewer öffnen und Löschen; Speichern als neue Karte getrennt anbieten.
- Automatische Sicherungen in einem eigenen aufklappbaren Bereich mit Datum, Vorschau und bewusster Wiederherstellung darstellen.
- Kartendaten importieren hier platzieren; verständlich zwischen statischem Kartenimport und vollständigem Plan öffnen unterscheiden.
- Speicherstatus, Fehler und Konflikte verständlich anzeigen. Archivzugang sichern/importieren weiterhin erreichbar halten.
- Beim Teilen genau zwischen letztem manuell gesicherten Stand und Sichern und teilen unterscheiden.

Abnahme:

- [x] Automatische Entwürfe überschreiben keinen manuell gesicherten Stand; ein Viewer veröffentlicht keinen ungesicherten Entwurf ohne ausdrückliche Aktion.
- [x] Import, Laden, Wiederherstellen, Konflikt und Netzwerkfehler bewahren vorhandene Arbeit, wenn der Vorgang abgebrochen oder abgewiesen wird.
- [x] Vorhandene Archivschlüssel, Dokument-IDs, Freigabelinks und alle 21 Season-/Layoutvarianten funktionieren weiter.

Abschlussnachweis: Umsetzung und geprüfte Zugänge in `VERIFICATION-2.0.0.md`; Änderungen in `dist/atelier.js`, `dist/atelier.css`, `dist/app.js`, `dist/i18n.js`, `dist/themes.js`, `dist/index.html` und `viewer/`. 27 Funktionstests, Archivdiensttests, echte Chrome-Abnahme sowie Standalone-/S04-/Exportprüfung erfolgreich. Konkrete Messwerte und bewusste Grenzen sind im Abnahmebericht dokumentiert.

## G05 Neue Pläne geführt einrichten

Status: abgeschlossen. Voraussetzung: G04.

Ergebnis: Ein kurzer optionaler Einstieg hilft beim Anlegen einer neuen Karte, ohne die spätere Bearbeitung vorzuschreiben.

Umfang:

- Eine kurze Einrichtung für Karte/Season/Layout, Allianz und Start anbieten; Kartenimport und Spielerliste sind optionale Ergänzungen.
- Mit genau einer bearbeitbaren Allianz beginnen. Ein sinnvoller Standard ermöglicht den Start ohne Pflichtangaben.
- Bestehende Import- und Allianzdialoge wiederverwenden; spätere Änderungen bleiben direkt im Kartenatelier möglich.
- Zurück und Abbrechen erhalten Eingaben beziehungsweise den bisherigen Plan. Bestehende Pläne öffnen direkt im Editor.

Abnahme:

- [x] Eine neue leere Karte lässt sich ohne Datenimport und ohne Spielerliste erstellen.
- [x] Abbrechen oder Zurück zerstört keinen zuvor geöffneten Plan.
- [x] Es entsteht kein zweiter dauerhafter Bearbeitungsmodus; nach der Einrichtung landet der Nutzer im normalen Kartenatelier.

Abschlussnachweis: Umsetzung und geprüfte Zugänge in `VERIFICATION-2.0.0.md`; Änderungen in `dist/atelier.js`, `dist/atelier.css`, `dist/app.js`, `dist/i18n.js`, `dist/themes.js`, `dist/index.html` und `viewer/`. 27 Funktionstests, Archivdiensttests, echte Chrome-Abnahme sowie Standalone-/S04-/Exportprüfung erfolgreich. Konkrete Messwerte und bewusste Grenzen sind im Abnahmebericht dokumentiert.

## G06 Objekte direkt und verständlich bearbeiten

Status: abgeschlossen. Voraussetzung: G03.

Ergebnis: Auswahl, Platzierung und Änderungen erfolgen direkt an der Karte mit einem kompakten Bearbeitungsbereich.

Umfang:

- Bei Auswahl Name, Objektart, Größe, Mittelpunktkoordinaten, gegebenenfalls Level und Spielerzuweisung zeigen; seltene Aktionen ausklappen.
- Verschieben, Auswählen und Zeichnen mit eindeutigem Cursor und sichtbarem aktiven Werkzeug unterscheiden; Escape bricht einen laufenden Schritt ab.
- Mehrfachauswahl, Sperren, Kopieren, Duplizieren, Gruppieren, Ausrichten, Größenänderung und Rückgängig/Wiederholen erhalten.
- Exakte ganzzahlige Feldplatzierung, 1000×1000-Weltgrenzen, vorhandene Mittelpunktregeln und ein einziges echtes 1×1-Raster weiterverwenden.

Abnahme:

- [x] Eine Basis belegt weiterhin genau 3×3 Felder; alte Objekte ändern durch den Umbau keine belegten Felder.
- [x] Ungültige Verschiebungen oder Gruppenaktionen hinterlassen keine Teiländerung.
- [x] Der Bearbeitungsbereich verdeckt die aktive Auswahl nicht dauerhaft und verliert bei anderen UI-Aktualisierungen keine Eingaben.

Abschlussnachweis: Umsetzung und geprüfte Zugänge in `VERIFICATION-2.0.0.md`; Änderungen in `dist/atelier.js`, `dist/atelier.css`, `dist/app.js`, `dist/i18n.js`, `dist/themes.js`, `dist/index.html` und `viewer/`. 27 Funktionstests, Archivdiensttests, echte Chrome-Abnahme sowie Standalone-/S04-/Exportprüfung erfolgreich. Konkrete Messwerte und bewusste Grenzen sind im Abnahmebericht dokumentiert.

## G07 Allianzen und Spieler einfach verwalten

Status: abgeschlossen. Voraussetzung: G03, G06.

Ergebnis: Allianzen, Spielerlisten und Zuweisungen sind ohne zusätzliche permanente Menüs bedienbar.

Umfang:

- Aktive Allianz mit Name und Farbpunkt anzeigen; Name/Farbe ändern und Allianz hinzufügen im selben kompakten Menü anbieten.
- Im Bereich Spieler Suche, Import und Zuweisung direkt anbieten; Prioritäten, Freundesgruppen und automatische Spielerzuweisung als aufklappbare Organisation erhalten.
- Aktive Allianz, Mehrfachauswahl und Auswirkungen von Sammelaktionen ausdrücklich anzeigen.
- Bestehende Allianz-IDs, Farben, Zugehörigkeiten, gemeinsame Daten aller Varianten und rosterbezogene Regeln erhalten.

Abnahme:

- [x] Ein neuer Plan zeigt nur seine eine Allianz; weitere erscheinen erst nach dem Hinzufügen.
- [x] Gleichnamige Spieler unterschiedlicher Allianzen bleiben getrennt und eindeutig zuweisbar.
- [x] Autofill, Prioritäten, Gruppen, feste Zuweisungen, Blueprints und Mehrfachaktionen bleiben erreichbar und funktional erhalten.

Abschlussnachweis: Umsetzung und geprüfte Zugänge in `VERIFICATION-2.0.0.md`; Änderungen in `dist/atelier.js`, `dist/atelier.css`, `dist/app.js`, `dist/i18n.js`, `dist/themes.js`, `dist/index.html` und `viewer/`. 27 Funktionstests, Archivdiensttests, echte Chrome-Abnahme sowie Standalone-/S04-/Exportprüfung erfolgreich. Konkrete Messwerte und bewusste Grenzen sind im Abnahmebericht dokumentiert.

## G08 Hive prüfen und Bereich füllen klar trennen

Status: abgeschlossen. Voraussetzung: G06.

Ergebnis: Zwei leicht verständliche Abläufe mit wenigen Optionen und den bereits bestätigten, getrennten Regeln.

Umfang:

- Prüfen zeigt Bereich zeichnen, Prüfung starten und Fundstellen. Zeichnen verwendet Fadenkreuz/Stift; der Bereich bleibt verschiebbar und an Ecken/Kanten skalierbar.
- Die geometrische Prüfung sucht ausschließlich kollisionsfreie 3×3-Basisflächen: Kontakt zu Basen oder Hindernissen ist zulässig, Schlamm ebenfalls. Füllabstände sind keine Prüfblocker.
- Innenlücken auch in einem großen Prüfbereich erhalten und auffindbar machen; die Kamera nur auf ausdrücklichen Trefferklick bewegen.
- Bereich füllen unter Bauen anbieten: Abstand 0/1/2, Schlammrand blockieren, Vorschau und Basen erzeugen.
- Bei aktivem Schlammrand darf nur ein äußerer ein Feld breiter Basisstreifen in den Schlamm ragen; diese Ausnahme hat Vorrang vor dem Abstand zum Schlamm. Inaktiv bleiben Basen einschließlich gewähltem Abstand außerhalb.
- Gewählten Abstand zu anderen Basen und tatsächlichen Blockern erhalten, einschließlich Zentrum, Gebäudekernen, Bergen und Seen; Vorschau erst nach Bestätigung übernehmen.

Abnahme:

- [x] Die bekannte Stelle X865/Y713 wird am passenden Bestandsplan mit ihrer vollständigen 3×3-Fläche gegen die tatsächlichen Blocker geprüft.
- [x] Eine Vergrößerung des Prüfbereichs entfernt keine vorher zulässigen Innenfundstellen; überlappende Kandidaten werden als Alternativen erklärt.
- [x] Füllen und Prüfen haben getrennte Tests für Schlamm, Berührung, echte Kollisionen, Weltgrenzen und unregelmäßige Terrainkanten.
- [x] Eine Füllaktion ist vollständig als ein Schritt rückgängig machbar; Abbrechen verändert den Plan nicht.

Abschlussnachweis: Umsetzung und geprüfte Zugänge in `VERIFICATION-2.0.0.md`; Änderungen in `dist/atelier.js`, `dist/atelier.css`, `dist/app.js`, `dist/i18n.js`, `dist/themes.js`, `dist/index.html` und `viewer/`. 27 Funktionstests, Archivdiensttests, echte Chrome-Abnahme sowie Standalone-/S04-/Exportprüfung erfolgreich. Konkrete Messwerte und bewusste Grenzen sind im Abnahmebericht dokumentiert.

## G09 Kartenoptik und Viewer vereinheitlichen

Status: abgeschlossen. Voraussetzung: G03, G06.

Ergebnis: Editor und Viewer wirken zusammengehörig und zeigen dieselbe Geometrie und verständliche Objektinformationen.

Umfang:

- Planansicht und Spieloptik beibehalten; die Umschaltung auch im Viewer unmittelbar zugänglich machen.
- Zentrierte Objektbeschriftungen mit Typ/Name, Größe, Mittelpunkt und gegebenenfalls Level erhalten; vorhandene Anzeigeschalter sinnvoll bündeln.
- HQ 27 als ausgewählte Basisgrafik sowie detaillierte Grafiken für Heiligen Berg, Heiligen Baum, Statuen und Trading Posts erhalten; Berge, Seen und Städte weiter darstellen.
- Viewer auf Suche, Navigation, Ansichtswechsel, Aktualisieren und vorhandene lokale Raketensimulation konzentrieren; Bearbeitung und private Archivaktionen bleiben ausgeschlossen.
- Darstellung und Beschriftungen der SVG-/PNG-Exporte mit dem gemeinsamen Renderer synchron halten.

Abnahme:

- [x] Dieselbe gespeicherte Karte behält in Editor, Viewer und Export exakt dieselben Positionen und Hindernisflächen.
- [x] Viewer-Ansichtswahl und Raketensimulation verändern weder den gespeicherten Plan noch die Ansicht anderer Personen.
- [x] Viewer-Daten enthalten weiterhin keine Archivschlüssel, privaten Spielerlisten, Prioritäten oder Editor-Gruppen.

Abschlussnachweis: Umsetzung und geprüfte Zugänge in `VERIFICATION-2.0.0.md`; Änderungen in `dist/atelier.js`, `dist/atelier.css`, `dist/app.js`, `dist/i18n.js`, `dist/themes.js`, `dist/index.html` und `viewer/`. 27 Funktionstests, Archivdiensttests, echte Chrome-Abnahme sowie Standalone-/S04-/Exportprüfung erfolgreich. Konkrete Messwerte und bewusste Grenzen sind im Abnahmebericht dokumentiert.

## G10 Kleine Bildschirme und flüssige Bedienung

Status: abgeschlossen. Voraussetzung: G05, G07, G08, G09.

Ergebnis: Die neue Oberfläche bleibt auf Desktop, Tablet und kleinen Displays gut bedienbar und schnell.

Umfang:

- Seitenbereiche auf schmalen Displays passend einklappen oder als zeitweise geöffnete Flächen darstellen; Karte und wesentliche Aktionen bleiben erreichbar.
- Touch-Ziele von etwa 44×44 Pixeln, lesbare Eingaben, Tastaturbedienung, Fokusführung und Escape-Verhalten prüfen.
- Vorhandene dauerhafte Karten- und Textur-Ebenen erhalten; UI-Änderungen dürfen keinen vollständigen Kartenneuaufbau bei jedem Pan/Zoom auslösen.
- Mit vollständigen S04-Kartendaten und kleinen sowie großen Hives Pan, Zoom, Auswahl, Ziehen, Bereichsänderung und beide Ansichten gegen G01 vergleichen.

Abnahme:

- [x] Keine abgeschnittenen Hauptaktionen oder unbeabsichtigte horizontale Seitenverschiebung bei 320/360/768/1024 Pixeln und einem breiten Desktop.
- [x] Dialoge und Menüs lassen sich mit Tastatur öffnen, bedienen und schließen; Fokus kehrt sinnvoll zurück.
- [x] Pan/Zoom lädt oder erzeugt statische Texturen nicht erneut. Messwerte zeigen keine wesentliche Verschlechterung gegenüber 1.2.5; Abweichungen werden vor Abnahme behoben.

Abschlussnachweis: Umsetzung und geprüfte Zugänge in `VERIFICATION-2.0.0.md`; Änderungen in `dist/atelier.js`, `dist/atelier.css`, `dist/app.js`, `dist/i18n.js`, `dist/themes.js`, `dist/index.html` und `viewer/`. 27 Funktionstests, Archivdiensttests, echte Chrome-Abnahme sowie Standalone-/S04-/Exportprüfung erfolgreich. Konkrete Messwerte und bewusste Grenzen sind im Abnahmebericht dokumentiert.

## G11 Kompatibilität und vollständige Abnahme

Status: abgeschlossen. Voraussetzung: G04, G05, G07, G08, G09, G10.

Ergebnis: Version 2.0 ist anhand echter Arbeitsabläufe und bestehender Daten abgesichert.

Umfang:

- Relevante vorhandene Modell-, UI-, Viewer- und Archivdiensttests an die neue Oberfläche anpassen, ohne fachliche Erwartungen abzuschwächen; abschließend die vollständige Suite ausführen.
- Alte JSON-Pläne, lokale Entwürfe, Archivdokumente, Freigaben und alle 21 Varianten laden, speichern und vergleichen.
- Browserabläufe für Neuer Plan, Import, Allianzen, Spieler, Einzel-/Mehrfachbearbeitung, Prüfen, Füllen, Sichern, Wiederherstellen, Teilen und Export testen.
- Alle sieben Sprachen, beide Darstellungsarten, helle/dunkle Gestaltung und repräsentative Bildschirmgrößen prüfen.
- Nur tatsächlich erforderliche UI-Einstellungen migrieren. Eine neue App-Versionsnummer ist kein Grund für einen neuen Plandaten-Schemawert.

Abnahme:

- [x] Keine verlorenen Objekte, Koordinaten, Spielerzuweisungen, Farben, Terrainmasken oder Varianten beim Hin- und Rückspeichern.
- [x] Keine ungewollten Archivschreibvorgänge oder Datenfreigaben durch reine Anzeige- und Navigationsaktionen.
- [x] Tests und manuelle Browserprüfung sind dokumentiert; keine offenen Fehler mit Datenverlust, falscher Geometrie oder unbedienbaren Hauptabläufen.

Abschlussnachweis: Umsetzung und geprüfte Zugänge in `VERIFICATION-2.0.0.md`; Änderungen in `dist/atelier.js`, `dist/atelier.css`, `dist/app.js`, `dist/i18n.js`, `dist/themes.js`, `dist/index.html` und `viewer/`. 27 Funktionstests, Archivdiensttests, echte Chrome-Abnahme sowie Standalone-/S04-/Exportprüfung erfolgreich. Konkrete Messwerte und bewusste Grenzen sind im Abnahmebericht dokumentiert.

## G12 Version 2.0.0 veröffentlichen und rücksetzbar halten

Status: in Veröffentlichung. Voraussetzung: G11.

Ergebnis: Ein einheitlicher, geprüfter Release mit weiterhin verfügbarem Rückweg zu 1.2.5.

Umfang:

- APP_VERSION sichtbar auf 2.0.0 setzen; README, Versionsregeln und Releasehinweise auf den tatsächlichen Endstand bringen.
- Standalone-HTML und Viewer-Build aus den finalen Quellen erzeugen; Editor-Site, Viewer-Dienst und GitHub-/Pages-Spiegel synchron halten.
- Vor Veröffentlichung einen Abschluss-Snapshot von 2.0 erstellen und den verifizierten 1.2.5-Rückweg dokumentieren.
- Über die bereits autorisierten Veröffentlichungswege bereitstellen und danach Version, Laden, Sichern und Viewer auf den tatsächlichen Zieladressen prüfen.
- Bestehende Sichtbarkeit, Archivzugänge und Freigabelinks erhalten.

Abnahme:

- [ ] Editor, Viewer und Standalone verwenden zusammenpassende Quellen; sichtbare Version und Releasehinweise stimmen überein.
- [ ] Die tatsächlichen veröffentlichten Hauptabläufe funktionieren; ein fehlgeschlagenes Deployment wird nicht als abgeschlossen gemeldet.
- [ ] Das Backup von 1.2.5 bleibt unverändert erhalten und die Wiederherstellung ist nachvollziehbar dokumentiert.

Abschlussnachweis: wird bei Umsetzung ergänzt.

