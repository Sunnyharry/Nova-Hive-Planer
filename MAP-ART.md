# Spielgrafiken im Planer

Die ursprünglichen S04-Grafiken stammen aus dem lokalen Spielcache. Version 1.2.4 ergänzt `dist/map-visuals.js`: drei Bergvarianten, eine statische Wasseransicht und sieben größere Stadtillustrationen. Diese Datei enthält nur Bilder und die optische Zuordnung bekannter S04-Flächen.

Die Bergansichten wurden aus dem Original-Mesh `O_env_mountain_01` und den Materialien der S04-Objektdefinitionen 1, 62 und 63 von oben gerendert. Die Instanzen erhalten Position, Rotation und Skalierung aus `NewWorldSceneDesc_s4`. Eine Flächensignatur verhindert, dass eine gleich benannte, aber geometrisch andere Importfläche die falsche Grafik erhält.

Seen verwenden die Tiefenmaske und Tief-/Flachwasserfarben des Materials von `shangjihe_s4` (Objekt 49). Das ist eine statische Annäherung; die animierten Unity-Wasser- und Beleuchtungsshader laufen nicht im Planer. Städte/Hauptstadt verwenden die originalen `Mjc_S4_csjs_build_lv1` bis `lv7`-Illustrationen. Transparente Ränder wurden beschnitten und die Bilder für die Anzeige verkleinert. Strongholds und Trading Posts behalten ihre originalen Symbole.

Die neuen Ansichten sind als komprimierte WebP-Grafiken eingebettet. Berge und Seen werden auf ihre bestehenden Feldmasken zugeschnitten; Bilder ändern niemals Blockerfelder, Abstände oder Koordinaten. In der Planansicht bleiben die exakten farbigen Formen und mittigen Beschriftungen erhalten.

Version 1.2.5 ergänzt fünf komprimierte WebP-Bilder aus dem lokalen Spielcache:

- Basis: `UI_building_10100027` aus `BuildIconOutCity`, die vom Nutzer gewählte Standard-HQ-27-Illustration (Vorschlag Nr. 4).
- Heiliger Baum: `O_env_S4_shijieshu_D` aus `worldcity_S4_shijieshu`, die Originaltextur der Nahansicht.
- Heiliger Berg: `O_env_S4_fushishan_` (559 Vertices) mit `O_env_S4_fushishan_D` aus `worldcity_S4_fushishan`. Statische orthografische Ansicht aus Modell und UV-Daten; Unity-Beleuchtung und Animationen werden nicht nachgebildet.
- Samurai-Statue: `O_env_S4_shixiang_D` aus S04-Dekorationsdefinition 67 (`shixiang_02`).
- Trading Post: `maoyizhan` aus `worldCityTrading_S4`, die Originaltextur der Nahansicht.

Die normalen Prefabs liefern die natürlichen Farben; die separaten `_wuran`-Varianten wurden nicht verwendet. Baum, Statue und Trading Post besitzen im Spiel bereits flache Bildflächen für diese Ansicht. Ihre Schatten sind Teil der Originalbilder. Die Grafiken ändern keine Kollisionsflächen. Strongholds behalten vorerst ihr bisheriges Symbol.

Version 2.0.1 ergänzt das Allianzzentrum: `build_Zhudian` (512 × 512) aus `Assets/Main/SeasonRes/S4/Sprites/AllianceBuilding/build_Zhudian.png`, Bundle 19443. Verwendet wird die originale farbige Gebäudeillustration des zentralen Stromturms, nicht die einfache Plattform `build_Qianyidian` oder das Lager `build_Cangku`. Transparente Ränder beschnitten, WebP Qualität 88. Keine Animationen oder zusätzlichen Anbauten. Die Spielfläche bleibt 9 × 9; der optionale Stromaufladebereich ist separat 41 × 41.
