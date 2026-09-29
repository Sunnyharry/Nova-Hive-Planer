# Nova Hive Planner 1.2.4

**Hive prüfen:** Nur die neun Felder einer 3×3-Basis zählen. Direkter Kontakt zu Basen, Gebäudekernen, Bergen oder Seen ist erlaubt. Schlamm ist vollständig bebaubar. Füllabstände, Schlammrandoption und Allianzfilter beeinflussen die Landeflächenprüfung nicht. Schon ein überlappendes Blockerfeld verhindert die Landung.

Die Berechnung verwendete diese Regeln bereits. Korrigiert wurde die Übersichtsdarstellung: Sie markierte nur die unteren linken Ankerfelder und ließ dadurch zwei Reihen der tatsächlichen Landefläche unmarkiert. Jetzt werden in jeder Zoomstufe die vollständigen 3×3-Grundflächen dargestellt. Auch eine fokussierte Fundstelle erhält keinen vergrößerten Rahmen mehr. Bei X865/Y713 ist im S04-Import eine Basis möglich; X864/Y713 darf direkt an den Berg anschließen. Geplante Basen werden zusätzlich auf echte Überschneidung geprüft.

**Spieloptik:** Die bekannten S04-Berge erhalten Ansichten aus ihren ursprünglichen Meshes und Texturen. Seen erhalten eine statische Wasseransicht aus der Original-Tiefenmaske und den Materialfarben. Städte und die Hauptstadt verwenden die größeren Originalillustrationen nach Stufe. Quellen, Zuordnung und Grenzen: [MAP-ART.md](MAP-ART.md). Bestehende importierte Karten brauchen keinen neuen Import; ihre Blockerfelder bleiben gleich.

**Viewer:** Über Darstellung kann jeder Betrachter selbst Planansicht oder Spieloptik wählen. Die Wahl bleibt lokal in seinem Browser erhalten und verändert weder den gespeicherten Plan noch den Link. Ein Wechsel erhält den aktuellen Kartenausschnitt.
