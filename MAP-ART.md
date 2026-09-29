# Spielgrafiken im Planer

Die ursprünglichen S04-Grafiken stammen aus dem lokalen Spielcache. Version 1.2.4 ergänzt `dist/map-visuals.js`: drei Bergvarianten, eine statische Wasseransicht und sieben größere Stadtillustrationen. Diese Datei enthält nur Bilder und die optische Zuordnung bekannter S04-Flächen.

Die Bergansichten wurden aus dem Original-Mesh `O_env_mountain_01` und den Materialien der S04-Objektdefinitionen 1, 62 und 63 von oben gerendert. Die Instanzen erhalten Position, Rotation und Skalierung aus `NewWorldSceneDesc_s4`. Eine Flächensignatur verhindert, dass eine gleich benannte, aber geometrisch andere Importfläche die falsche Grafik erhält.

Seen verwenden die Tiefenmaske und Tief-/Flachwasserfarben des Materials von `shangjihe_s4` (Objekt 49). Das ist eine statische Annäherung; die animierten Unity-Wasser- und Beleuchtungsshader laufen nicht im Planer. Städte/Hauptstadt verwenden die originalen `Mjc_S4_csjs_build_lv1` bis `lv7`-Illustrationen. Transparente Ränder wurden beschnitten und die Bilder für die Anzeige verkleinert. Strongholds und Trading Posts behalten ihre originalen Symbole.

Die neuen Ansichten sind als komprimierte WebP-Grafiken eingebettet. Berge und Seen werden auf ihre bestehenden Feldmasken zugeschnitten; Bilder ändern niemals Blockerfelder, Abstände oder Koordinaten. In der Planansicht bleiben die exakten farbigen Formen und mittigen Beschriftungen erhalten.
