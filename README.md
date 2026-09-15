# Nova Hive Planner

Current application release: **1.1.2**. Increase the final number once per subsequent delivered update (1.1.3, 1.1.4, …); see `AGENTS.md`. The JSON schema version remains independent.

A client-side Last War hive editor with English, German, French, Spanish, Portuguese, Vietnamese and Korean interfaces. Open `dist/index.html` in a modern browser, or serve the `dist` directory as static files. No dependencies, external assets, database or application login are required. The hosted Site has its own owner access policy.

The editor supports editable 100-seat templates with one-tile gaps or no gaps, TXT / semicolon CSV imports, individual placement and movement, grouped autofill, undo/redo, JSON save/load, and SVG, PNG and CSV exports. Player names and their calculated X/Y coordinates appear inside each base.

## Download and open

Download `nova-hive-planner.html` from this repository and open it in a modern browser. This standalone file includes all code and styles and works offline. For development, use the editable files in `dist/`.

## Seasons and coordinates

The season selector is at the top of the right panel. Off Season uses a central Marshall with bases around it and supports bases, Marshall and terrain only. Season 4 retains the Alliance Center, four beacon players and light ranges. Seasons 1, 2, 3, 5 and 6 provide basic layouts with a prominent localized **Under development** banner above the map; they do not implement seasonal special mechanics.

Changing season recreates the current spaced/compact template and removes custom geometry, including terrain. The displayed note explains this, and an unsaved plan triggers confirmation. Player names and group memberships remain; assignments are mapped to matching seats where available. Undo restores the complete preceding plan. An explicitly empty layout remains empty until a template or objects are added.

One drawing unit is one actual map tile. Bases are 3×3, the Alliance Center is 9×9, and default L4 coverage is 25×25 centered on the beacon. Marshall uses the 3×3 planning cell from the supplied layout. The coordinate reference is the Alliance Center in Season 4 and the Marshall in the other modes. Positive X is right and positive Y is up. Moving the reference in the drawing retains its entered world coordinate and recalculates other coordinates. Removing it retains the marked origin. Light coverage is a geometric planning model; check the in-game buff at boundaries.

## Players and groups

Player files accept UTF-8 and BOM-marked UTF-16. TXT contains one name per line; CSV contains names separated by semicolons or line breaks, with optional quoted fields and escaped double quotes. Empty fields and duplicate names are skipped. Invalid files leave the plan intact. A CSV header is treated as a player name.

The red **Remove all players** button below the roster clears all names, assignments and group memberships in one click. Bases, terrain, reference coordinates and season stay intact. Undo restores the complete preceding state.

The visible **Groups** selector below the player list offers Group 1–10. Choosing one opens its drop zone: drag player names into it, or use the player dropdown and + button. Membership is shown beside names in the roster. The × in a group removes membership only. Each player belongs to at most one group; adding them elsewhere transfers membership. A selected assigned base also offers a group selector in the right panel.

Autofill never moves assigned players and creates no new bases. Groups with manually placed members use those members as fixed anchors; other groups seek compact connected clusters near the reference. A bounded multi-start search favors connectivity and short pairwise distances, then centrality. After groups, individual players use roster order and increasing squared Euclidean distance to the reference, with seat number and ID as deterministic ties. Empty beacon seats remain reserved unless explicitly included.

Neighboring bases may touch at an edge or corner. In a one-tile-gap template, adjacent seats across that gap count as connected. Autofill is a best-effort placement heuristic, not a proof of a globally optimal layout. Fixed assignments or a shortage of neighboring seats may split groups; the actual result names affected groups. Group status also shows whether its placed members are connected.

The **Remove all players from Hive** button at the bottom of the right panel clears assignments only, including beacon players. It retains the roster, group memberships, all map objects and reference coordinates. Undo restores the assignments. It is disabled when no bases are assigned.

## Adding objects with hotkeys

Press **B** for a base, **M** for Marshall, **A** for the Alliance Center, **T** for terrain, or **L** for a beacon, then click the desired position. Button hover titles and map-object tooltips show the shortcuts in the active language. Shortcuts do not run while entering text, using dialogs, dragging, composing characters or holding Ctrl/Command/Alt; they ignore automatic key repeats. A and L follow the existing Season-4 restriction. M and A select an existing unique object when already present. Escape cancels placement.

## Terrain

Selected terrain shows four outward-facing corner arrow handles. Dragging a corner fixes the opposite corner, previews the dimensions, and snaps both dimensions to whole tiles (1–60 each). Red previews indicate blocked placements; releasing an invalid resize leaves the original geometry intact. A focused corner handle also accepts arrow keys, with Shift for five tiles. The right-panel width/height form remains available and resizes around the center. Terrain may overlap other terrain; buildings may overlap neither terrain nor buildings. Overlapping terrain can be selected through the right-panel terrain selector.

## Persistence and validation

Plans are stored in explicit JSON files, not browser or cloud storage. Only the interface language is remembered on the device. Version-2 plans include season and groups. Version-1 plans migrate to Season 4 with empty groups, retaining names, geometry and assignments. Switching language preserves plan data and history; default map labels, help, errors and image/CSV export labels use the active language. Player names and custom labels stay as entered. CSV exports include group membership.

Names are escaped in SVG/HTML, and CSV exports guard spreadsheet formula prefixes. JSON imports validate schema, season rules, memberships, assignments, geometry and collisions before changing the plan.

Run the automated checks from the project root:

```
node --check dist/i18n.js
node --check dist/model.js
node --check dist/app.js
node test/model.test.cjs
node test/season-groups.test.cjs
node test/i18n.test.cjs
```

These cover layout geometry, imports, all season modes, grouped autofill and fixed anchors, split-group reporting, terrain corner mathematics and collision rejection, clearing with intact undo snapshots, legacy file migration, and all localized messages in seven languages. Interface bindings and local assets were statically audited. Browser interaction and visual checks were not run in this update.

Optional WebMCP tools register only when `document.modelContext` supports them and use the same model and state as the visible planner. Their browser registration has not been tested.
