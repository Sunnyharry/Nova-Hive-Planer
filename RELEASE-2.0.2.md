# Nova Hive Planner 2.0.2

- Fehlende Berggrafiken in der S04-Spieloptik korrigiert. 29 Berginstanzen hatten durch mehrfach verwendete Szenen-IDs falsche Bildpositionen. Ihre Texturen lagen dadurch außerhalb der zugehörigen Fläche und wurden abgeschnitten. Die Zuordnung berücksichtigt jetzt auch Objekttyp und Kartenanker.
- Der gemeldete Berg **X835–851 / Y653–670** zeigt jetzt seine Originaltextur.
- Alle zehn importierten Sushi-Restaurants erhalten die originale `shousidian_D`-Grafik der Nahansicht.
- Die Korrekturen gelten für Editor, Viewer, Standalone und Bildexport. Die vorhandene S04-Importdatei und gespeicherte Pläne können unverändert weiterverwendet werden. Blockerfelder, Koordinaten und Platzierungsregeln ändern sich nicht.

Prüfung: alle 45 Bergflächen (60 Instanzen), 15 Seeinstanzen und zehn Restaurants; Regressionstest für den gemeldeten Berg, vollständige Flächensignaturen, Bildpositionen und gemeinsame Darstellung.
