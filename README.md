# Nova Hive Planner

Current application release: **1.1.17**. Increase the final number once per subsequent delivered update (1.1.18, 1.1.19, …); see `AGENTS.md`. The JSON schema version remains independent.

A client-side Last War hive editor with English, German, French, Spanish, Portuguese, Vietnamese and Korean interfaces. Open `dist/index.html` in a modern browser, or serve the `dist` directory as static files. The editor has no package dependencies or application login. Named map storage and sharing use the separate online document service; local editing and JSON files remain available offline. The hosted Site has its own owner access policy.

The editor supports editable 100-seat templates with one-tile gaps or no gaps, TXT / semicolon CSV imports, individual and multiple-object movement, connected terrain shapes, rectangular base-area filling, priority-aware grouped autofill, multi-select organization, undo/redo, JSON save/load, and SVG, PNG and CSV exports. Player names and their calculated X/Y coordinates appear inside each base.

## Viewer share address

New viewer links use `https://sunnyharry.github.io/Nova-Hive-Planer/viewer/?plan=<id>`, avoiding the account surname in the shared browser address. The static `viewer/` frontend is mirrored to GitHub Pages and reads the same public map ID through the existing CORS-enabled read-only API. Old viewer links remain valid. Saved maps, archive keys, permissions and IDs are unchanged. This changes the shared address, not the storage hostname: the existing API hostname remains visible in source/network requests. When updating the viewer, keep `viewer/index.html`, `viewer/viewer.css` and `viewer/viewer.js` aligned with the service frontend; the GitHub copy uses relative asset URLs, the shared `dist` model/i18n, and an absolute public API URL.

## Named map archive and viewer

The right panel **My maps** saves a named complete workspace online, including all 21 season/layout variants and their shared rosters. **Save map** updates the selected record; **Save as new** creates a separate map and viewer identity. Load and delete are available on each scrollable card. Loading confirms replacement of unsaved changes. Deleting a saved map preserves the currently open editor and revokes its public viewer. Explicit JSON Save/Open and exports still work as before.

Documents live in the separate Nova Hive Viewer service using R2. Only a random 256-bit private archive key is stored on this browser. Back up that key using **Back up archive access** to reopen the same archive from another browser, domain, or device, or after clearing browser data. Keep it private: it grants archive editing, while the viewer link grants read-only access to one published map. API writes use version checks and conditional R2 writes to reject stale saves rather than silently overwrite another session.

**Open / share viewer** saves and publishes the currently open variant, then opens a new tab with a stable per-map link. Subsequent saves of that shared record update the same URL. Viewer visitors can pan, zoom with mouse or pinch, and search assigned players across all alliances. The viewer does not expose editor controls, the private access key, other variants, unplaced roster members, priorities or friend groups. Changes appear on page load or **Refresh**. Anyone holding the viewer link can read the published map; no public index of maps is offered. Private archive operations require the key. Network failures preserve the editor state and report an error; saving online requires a connection.

The public service is https://nova-hive-viewer.georgiadis-c.chatgpt.site. The existing editor Site retains its private audience. GitHub Pages and the standalone editor use the same service; different browser origins need the same imported archive key to see the same archive.

## Terrain colors and landmarks

The terrain inspector offers a full hex color picker. Colors survive JSON save/open, every variant, named archive saves, and map exports. Changing a connected terrain shape's color updates all its parts. Existing uncolored terrain preserves its original style.

**Stronghold** defaults to a 13×13 overall footprint with a solid 5×5 core. **City** defaults to 15×15 with a solid 7×7 core. Their outer mud and solid core each have independently editable width and height in the inspector (whole tiles, 1–1000; the core must fit inside the mud). Numeric resizing preserves the outer bottom-left tile. Corner handles resize the outer footprint from the opposite corner and cannot shrink it below the core dimensions. The core is aligned to whole map tiles as close to the middle as possible; with mixed even/odd dimensions, the extra tile lies on the top/right. Enlarging a core into another building is rejected without changing the plan. Both have a brown buildable mud perimeter. Bases and other objects can occupy the perimeter; only the core participates in building collision checks. The overall footprint must still fit within the 1000×1000 world. Area filling, manual moves, multi-object moves, validation, save/open, exports and viewer use the same core collision rule. Coordinates denote the center of the entire outer footprint. Landmarks are available in all seasons and belong to the active alliance. Moving a landmark does not automatically move bases sitting on its mud.

**Missile** is a red 35×35 overlay by default, with editable width/height and corner resize handles. It can overlap any object or another missile in either placement order and never blocks base-area filling. Select it by its red border, label, or the central warning-symbol drag handle, leaving underlying bases clickable. Viewer visitors can drag the same central handle to simulate missile positions (whole tiles, within world bounds), or focus it and use arrow keys; Shift moves five tiles. Viewer simulations affect only the current view: they never write to the archive or change other visitors’ views. Reset missiles or Refresh restores saved positions. Other objects remain read-only. Only the world boundary limits its placement. Both new dimensions and missiles persist through save/open, archive, viewer and SVG/PNG export. Geometry schema 8 preserves support for schemas 1–7 and old default landmark sizes.

## Mega Hive: five alliances

The dropdown beside the object tools selects Alliance 1–5. Alliance 1 keeps the original appearance; Alliances 2–5 use yellow, green, purple and orange. All alliances share one finite map and remain visible. Their buildings block one another, and terrain remains impassable to every building. Each alliance can have one Alliance Center in Season 4 and one Marshall. Beacon letters can repeat between alliances, and coverage checks use only the target object's own alliance.

The selected alliance owns new bases, beacons, centers, Marshall and terrain. Imports, the roster, ten friend groups, priorities and priority labels, Autofill, area filling, clearing players and clearing assignments apply only to that alliance. Each alliance supports 300 players; the map retains the combined 800-object limit. Names can repeat in different alliances. Cross-alliance assignments and groups are rejected. Click another alliance's object to select that alliance automatically. Selection boxes act on the active alliance. Coordinate entry and dragging still operate in the same shared world.

Align selected alliance translates its own objects and checks collisions against the others. The map calibration remains shared, so other alliances' world coordinates do not change. Autofill and area filling use the selected alliance's own center or Marshall, falling back to the retained reference if none exists. Reset current variant rebuilds only the selected alliance in that variant and rejects overlaps instead of moving other alliances.

JSON saves preserve every alliance in all 21 variants, including the active alliance per variant. Rosters and organization remain shared between variants, separately for each alliance. Older plans default to Alliance 1. Geometry schema 6 added optional alliance IDs, active alliance and per-alliance priority labels; schemas 1–6 remain readable. CSV adds an alliance column; SVG/PNG exports show the full combined map with an alliance color legend.

## Seasons and coordinates

The season selector is at the top of the right panel. Off Season uses a central Marshall with bases around it and supports bases, Marshall and terrain only. Season 4 retains the Alliance Center, four beacon players and light ranges. Seasons 1, 2, 3, 5 and 6 provide basic layouts with a prominent localized **Under development** banner above the map; they do not implement seasonal special mechanics.

The season and layout dropdowns switch directly between **21 independent variants**: seven seasons × spaced, compact and empty layouts. Switching preserves the previous variant and restores the destination's exact objects, terrain connections, coordinates, player assignments, light settings and title. An edited empty layout remains an edited empty layout. Variants that have not been edited retain their initial template; no switch recreates an existing map.

**Reset current variant** is a separate, confirmed action. It resets only the selected alliance in the open variant to its template, keeping the other alliances, the other 20 variants and every roster. Undo restores the whole preceding workspace, including which variant was active. Player names, priorities, custom priority labels and friend groups are shared across all variants. Removing a player clears their assignments in every variant; **Remove all players from Hive** affects only the currently open variant.

The world contains exactly **1000×1000 tiles**, numbered **0–999** on each axis. Every displayed, entered and exported object coordinate identifies its **center**. A 3×3 base centered at X820/Y920 occupies X819–821 and Y919–921. Bases and Marshall use 3×3 cells, the Alliance Center uses 9×9, and default L4 coverage remains 25×25 centered on the beacon. Positive X is right and positive Y is up.

Select any base, beacon, Marshall, Alliance Center or terrain shape and enter its center X/Y in the right panel. Coordinates are whole numbers only, including after dragging, keyboard movement, corner resizing and area filling. The whole footprint must remain inside the map: a base center ranges from 1–998; an Alliance Center from 4–995. Invalid moves are rejected atomically. The **World map** button shows the entire finite world; **Fit** returns to the Hive. Panning and zooming remain bounded, and light overlays are clipped to the world edge.

Moving the Alliance Center or Marshall changes that object's position without changing other objects' world coordinates. The active reference still drives central Autofill. To translate the **entire** Hive, use **Align entire Hive** in the reference section; its X/Y also denotes the reference's center. This is rejected if any object would leave the world. Removing or re-adding a reference does not shift the other objects. Light coverage is a geometric planning model; check the in-game buff at boundaries.

## Players and groups

Player files accept UTF-8 and BOM-marked UTF-16. TXT contains one name per line; CSV contains names separated by semicolons or line breaks, with optional quoted fields and escaped double quotes. Empty fields and duplicate names are skipped. Invalid files leave the plan intact. A CSV header is treated as a player name.

The red **Remove all players** button below the roster clears the selected alliance’s names, assignments and group memberships in one click. Bases, terrain, reference coordinates and season stay intact. Undo restores the complete preceding state.

Open **Priority & groups** below the roster. Its arrow expands a drawer over the map, leaving the source roster visible and the map camera unchanged. The default **Priority** tab provides P1/P2/P3 columns with editable labels. The **Friend groups** tab displays all ten group cards in two columns on wide screens, with scrolling on smaller screens. The group selector from earlier versions has been replaced by these cards.

Every imported or previously unclassified player starts at **P2**. Default labels are **Reliable core**, **Active** and **Casual**; names can be changed without changing the P1→P2→P3 order. A player has exactly one priority and at most one friend group. Checkboxes support selecting a batch, selecting all visible search/filter results and clearing selection. Drag the selected batch into a column/card, or use the destination selector and **Assign** button for keyboard or touch. Selection survives tab switches, so the same batch can be classified both ways. Changes to priority and group membership are independent and each batch is one undo step. The × in a group removes membership only. Roster badges and the selected-base inspector show priority and group.

Autofill never moves assigned players or creates new bases. Groups with manually placed members are handled first, using those members as fixed anchors. All remaining groups and individuals share a ranking: an individual's score is their priority; a group's score is the arithmetic mean of **all** its members' priorities. Lower scores are handled first; ties follow original roster order, with no group-size bonus. Thus [P1, P1, P2] scores 1.33, ahead of a P2 individual; [P1, P3, P3] scores 2.33, behind that individual. There are no fixed-width priority rings.

For each group, a bounded multi-start search favors connected, compact clusters, then centrality. Newly assigned higher-priority members take the inner seats within that chosen cluster; existing members remain fixed. Individuals use the closest remaining seat by squared Euclidean distance to the reference, with seat number and ID as deterministic ties. Empty beacon seats remain reserved unless explicitly included. Manual anchors, terrain and group cohesion may prevent a strict global distance ordering by priority.

Neighboring bases may touch at an edge or corner. Adjacent seats across a template's one-tile gap or an area fill's chosen gap count as connected. Autofill is a best-effort placement heuristic, not a proof of a globally optimal layout. Fixed assignments or a shortage of neighboring seats may split groups; the actual result names affected groups. Group status also shows whether its placed members are connected.

The **Remove all players from Hive** button at the bottom of the right panel clears assignments only, including beacon players. It retains the roster, group memberships, all map objects and reference coordinates. Undo restores the assignments. It is disabled when no bases are assigned.

## Adding objects with hotkeys

Press **B** for a base, **M** for Marshall, **A** for the Alliance Center, **T** for terrain, or **L** for a beacon, then click the desired position. Button hover titles and map-object tooltips show the shortcuts in the active language. Shortcuts do not run while entering text, using dialogs, dragging, composing characters or holding Ctrl/Command/Alt; they ignore automatic key repeats. A and L follow the existing Season-4 restriction. M and A select an existing unique object when already present. Escape cancels placement.

## Terrain

Selected terrain uses **center** coordinates. A 5×5 area centered at X820/Y920 occupies X818–822 and Y918–922. Ambiguous axes in even sizes display X until manually confirmed. Changing width or height in the panel still keeps the bottom-left tile fixed and recalculates the center.

Selected, unconnected terrain shows four outward-facing corner arrow handles. Dragging a corner fixes the opposite corner, previews the dimensions, and snaps both dimensions to whole tiles (1–60 each). Red previews indicate blocked placements; releasing an invalid resize leaves the original geometry intact. A focused corner handle also accepts arrow keys, with Shift for five tiles. Terrain may overlap other terrain; buildings may overlap neither blocking terrain nor solid buildings; landmark mud remains buildable. Overlapping terrain can be selected through the right-panel terrain selector.

Select touching or overlapping terrain pieces with Ctrl/Command-click or a selection box, then choose **Connect terrain** in the right panel. They become one selectable, movable shape with a shared name and a continuous outline. Cutouts and holes remain empty and can contain buildings. Positioning a connected shape uses the center of its outer bounding rectangle. **Disconnect terrain** restores individual editing and corner resizing. Joining, separating, moving and deleting a shape are each one undo step.

## Map selection and area fill

The map toolbar offers **Pan view**, **Multi-select** and **Fill area**. Ctrl/Command-click adds or removes objects from the selection. Shift-drag starts a selection box from anywhere; in Multi-select mode, drag from empty space. Only fully enclosed pieces are selected, and a connected terrain shape is always selected as a whole. Drag any selected object to move the selection together, use arrow keys (Shift for five tiles), or enter X/Y offsets in the inspector. A collision cancels the entire move. Moving a selected reference changes its world coordinate just like any other selected object, while unselected objects remain fixed.

Choose **Fill area**, draw a rectangle and select **0, 1 or 2 tiles** between bases. The base preview and count update while drawing. After releasing, drag any of the four gold corner handles to enlarge or shrink the area; the opposite corner stays fixed. The preview reports the rectangle’s whole-tile width and height and the exact number of new bases. Focus a corner and use arrow keys (Shift for five tiles) for precise resizing. Corners snap to tile boundaries and stay inside the world; a cancelled pointer gesture restores the preceding preview. The preview shows whole 3×3 bases that fit inside both the rectangle and the 1000×1000 world, excluding terrain, existing buildings and the requested gap around existing bases. **Create bases** inserts the preview in one undoable step, up to the existing 800-object plan limit. This creates empty seats; **Autofill** then assigns players using their existing priorities and friend groups. Escape or Cancel discards the preview.

The fill grid is anchored to the Alliance Center in Season 4, or the Marshall in other modes. Without that object, it uses the retained map reference. Resizing the box only clips or reveals fixed grid positions. Candidates are ordered by distance from the reference before applying the 800-object cap; new seat numbers therefore start inside and work outward. Existing buildings and terrain remain fixed. A rectangle that excludes the center or obstacles next to it naturally prevents filling those inner positions.

The first row alongside the 9×9 Alliance Center is at most one tile away. For gaps 0 and 1, the grid is uniform throughout. With gap 2, outer intervals have exactly two empty tiles; the central transition has one empty tile. No interval is widened to three empty tiles: a 3×3 enemy base must not fit into a corridor of the generated grid. The same narrow transition applies when filling in stages or replacing a removed seat. No half-tile coordinates are introduced. Existing objects and saved layouts are never moved automatically. Obstacles, manually positioned objects, missing players, the object cap or a partial selection can still leave open spaces; this grid correction is not a guarantee about actual in-game occupancy.

## Persistence and validation

Plans can be saved in the online named archive described above and in explicit JSON files. The browser remembers the interface language and the archive access key; authoritative map documents are stored online. **Save plan** saves the entire workspace, including all 21 variants and the active season/layout. **Open** validates every variant before replacing any data, then returns to the saved active variant. Unsaved work requires replacement confirmation; cancelling keeps all variants unchanged. Undo can restore the entire workspace that was open before the import. Files are limited to 20 MB, with the existing 800-object limit per variant and 300-player roster limit per alliance.

The workspace file uses `nova-hive-workspace` version 1 and embeds geometry at plan version 7. The previous `nova-hive-planner` single-plan formats remain supported: their original season, layout and geometry become the active variant, with fresh templates for other variants. Older files contain only the single map that was saved. Versions 1–4 still migrate to the integer grid; out-of-world legacy plans are rejected without changing current work. Groups, priorities, assignments and terrain connections are retained where present.

Switching language preserves all variants and history; default labels, help, errors and export labels use the active language. Player names and custom labels stay as entered. PNG/SVG and CSV export only the active variant. CSV includes group membership, priority and its label.

Names are escaped in SVG/HTML, and CSV exports guard spreadsheet formula prefixes. JSON imports validate schema, season rules, memberships, priorities, priority labels, assignments, geometry and collisions before changing the plan.

Run the automated checks from the project root:

```
node --check dist/i18n.js
node --check dist/model.js
node --check dist/workspace.js
node --check dist/app.js
node test/model.test.cjs
node test/season-groups.test.cjs
node test/priority.test.cjs
node test/map-editing.test.cjs
node test/world-grid.test.cjs
node test/workspace.test.cjs
node test/save-open-handlers.test.cjs
node test/area-fill.test.cjs
node test/area-fill-handlers.test.cjs
node test/i18n.test.cjs
node test/alliances.test.cjs
node test/landmarks.test.cjs
```

These cover layout geometry, imports, all season modes, priority-aware grouped autofill, averages competing with individuals, fixed anchors, split-group reporting, exact bottom-left terrain placement, union outlines and holes, terrain connections and persistence, atomic multiple-object movement, all three fill spacings, obstacle avoidance and object limits, clearing with intact undo snapshots, finite-world boundaries for every object type, fixed unselected world positions when moving a reference, legacy file migration, and all 474 localized messages in seven languages. Workspace tests cover all 21 variants, independent geometry and assignments, shared organization, legacy imports and malformed-file rejection. An additional test executes the actual Save/Open, confirmation, dropdown, reset and undo/redo handlers with rendering stubbed; it checks that a custom empty map returns exactly. Area-fill tests scan every integer 3×3 footprint inside a complete unobstructed generated Hive to rule out enemy landing gaps and check staged filling and removed-seat repair. They also cover all spacing choices, anchored grid stability, center clearance, central-first truncation, preview/creation equality, live drawing and four-corner resizing, keyboard sizing, cancellation, world edges and undo through the actual event handlers with a DOM test double. Interface bindings and local assets were statically audited. Alliance tests additionally cover five independent centers, repeated names and beacon letters, scoped clearing and alignment, cross-alliance collision and assignment rejection, per-alliance coverage and legacy migration. Actual-handler tests exercise the alliance dropdown, center/base hotkeys, imports, Autofill, automatic alliance selection and exports. Visual browser checks were not run in this update.

Optional WebMCP tools register only when `document.modelContext` supports them and use the same model and state as the visible planner. Their browser registration has not been tested.

## Appearance themes

The dropdown beside Language offers Night (the original), Sky (light blue), Sand (warm neutrals) and Sage (soft green). Themes cover the full editor, map, dialogs and both viewers; the selected palette is remembered per browser origin. Theme switching only repaints the view, keeping geometry, camera, selection, saved plans and temporary missile positions intact. SVG and PNG exports use the current theme. Custom terrain colors, landmark cores and semantic alliance strokes are preserved. Names are translated in all seven languages.

## Center coordinates and object names (1.1.15)

All coordinate labels, rosters, previews, object inspectors, CSV and image exports, viewers and the read-only integration report object centers. The alignment form uses the selected alliance center/Marshall center. Existing saves retain exactly the same footprints and world origin; only the displayed reference changes. Right-hand Center X/Y moves the object or connected terrain to that reference.

Odd footprints have an exact middle tile. Even dimensions show X for the ambiguous axis until the user enters a whole-number value; that manual reference uses the left/lower middle tile and persists with the object. Dragging keeps that reference consistent. Resizing or changing terrain connections clears confirmation for a newly ambiguous center. Objects still occupy full integer map tiles within 0–999; no half-coordinate is shown to players. `coords` returns mathematical centers internally, `displayCoords` resolves this presentation convention, and explicitly named corner helpers remain for migration-era geometry tests.

Every object has an editable label, including empty and occupied bases. A base label is independent from its assigned player; both appear on the map when different, and viewer player search also matches the base label. Clearing the custom base label restores the assigned player or automatic seat label. Schema 9 persists base labels and manual-center confirmations, accepting older schemas without relocating objects.

## Selection center positioning (1.1.16)

The alliance alignment panel appears only when its reference object alone is selected. Multi-object selections can be placed by the center of their combined bounding rectangle; relative positions stay fixed and collision/world-boundary checks are atomic. Connected terrain parts are included automatically. Even-sized selection bounds follow the same X-placeholder and left/lower middle-tile convention as individual objects. Object coordinate labels, roster, exports and viewer use the shared center display helper.

## Selection scope (1.1.17)

The selection toolbar defaults to Current alliance. All alliances includes every object type in the selection rectangle and supports additive Ctrl/Cmd-click, rigid dragging, keyboard/delta moves, center positioning, removal and undo across alliances. Object ownership, colors and assignments remain intact. Switching back filters the selection to the active alliance. Connected terrain expands as one object; terrain belonging to different alliances cannot be merged. The selected-object count also reports the number of alliances for a mixed selection. Autofill and new objects continue to use the active alliance.
