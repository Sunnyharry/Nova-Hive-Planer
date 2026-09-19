# Nova Hive Planner

Current application release: **1.1.4**. Increase the final number once per subsequent delivered update (1.1.5, 1.1.6, …); see `AGENTS.md`. The JSON schema version remains independent.

A client-side Last War hive editor with English, German, French, Spanish, Portuguese, Vietnamese and Korean interfaces. Open `dist/index.html` in a modern browser, or serve the `dist` directory as static files. No dependencies, external assets, database or application login are required. The hosted Site has its own owner access policy.

The editor supports editable 100-seat templates with one-tile gaps or no gaps, TXT / semicolon CSV imports, individual and multiple-object movement, connected terrain shapes, rectangular base-area filling, priority-aware grouped autofill, multi-select organization, undo/redo, JSON save/load, and SVG, PNG and CSV exports. Player names and their calculated X/Y coordinates appear inside each base.

## Download and open

Download `nova-hive-planner.html` from this repository and open it in a modern browser. This standalone file includes all code and styles and works offline. For development, use the editable files in `dist/`.

## Seasons and coordinates

The season selector is at the top of the right panel. Off Season uses a central Marshall with bases around it and supports bases, Marshall and terrain only. Season 4 retains the Alliance Center, four beacon players and light ranges. Seasons 1, 2, 3, 5 and 6 provide basic layouts with a prominent localized **Under development** banner above the map; they do not implement seasonal special mechanics.

Changing season recreates the current spaced/compact template and removes custom geometry, including terrain. The displayed note explains this, and an unsaved plan triggers confirmation. Player names, priorities, custom priority labels and group memberships remain; assignments are mapped to matching seats where available. Undo restores the complete preceding plan. An explicitly empty layout remains empty until a template or objects are added.

One drawing unit is one actual map tile. Bases are 3×3, the Alliance Center is 9×9, and default L4 coverage is 25×25 centered on the beacon. Marshall uses the 3×3 planning cell from the supplied layout. The coordinate reference is the Alliance Center in Season 4 and the Marshall in the other modes. Positive X is right and positive Y is up. Moving the reference in the drawing retains its entered world coordinate and recalculates other coordinates. Removing it retains the marked origin. Light coverage is a geometric planning model; check the in-game buff at boundaries.

## Players and groups

Player files accept UTF-8 and BOM-marked UTF-16. TXT contains one name per line; CSV contains names separated by semicolons or line breaks, with optional quoted fields and escaped double quotes. Empty fields and duplicate names are skipped. Invalid files leave the plan intact. A CSV header is treated as a player name.

The red **Remove all players** button below the roster clears all names, assignments and group memberships in one click. Bases, terrain, reference coordinates and season stay intact. Undo restores the complete preceding state.

Open **Priority & groups** below the roster. Its arrow expands a drawer over the map, leaving the source roster visible and the map camera unchanged. The default **Priority** tab provides P1/P2/P3 columns with editable labels. The **Friend groups** tab displays all ten group cards in two columns on wide screens, with scrolling on smaller screens. The group selector from earlier versions has been replaced by these cards.

Every imported or previously unclassified player starts at **P2**. Default labels are **Reliable core**, **Active** and **Casual**; names can be changed without changing the P1→P2→P3 order. A player has exactly one priority and at most one friend group. Checkboxes support selecting a batch, selecting all visible search/filter results and clearing selection. Drag the selected batch into a column/card, or use the destination selector and **Assign** button for keyboard or touch. Selection survives tab switches, so the same batch can be classified both ways. Changes to priority and group membership are independent and each batch is one undo step. The × in a group removes membership only. Roster badges and the selected-base inspector show priority and group.

Autofill never moves assigned players or creates new bases. Groups with manually placed members are handled first, using those members as fixed anchors. All remaining groups and individuals share a ranking: an individual's score is their priority; a group's score is the arithmetic mean of **all** its members' priorities. Lower scores are handled first; ties follow original roster order, with no group-size bonus. Thus [P1, P1, P2] scores 1.33, ahead of a P2 individual; [P1, P3, P3] scores 2.33, behind that individual. There are no fixed-width priority rings.

For each group, a bounded multi-start search favors connected, compact clusters, then centrality. Newly assigned higher-priority members take the inner seats within that chosen cluster; existing members remain fixed. Individuals use the closest remaining seat by squared Euclidean distance to the reference, with seat number and ID as deterministic ties. Empty beacon seats remain reserved unless explicitly included. Manual anchors, terrain and group cohesion may prevent a strict global distance ordering by priority.

Neighboring bases may touch at an edge or corner. Adjacent seats across a template's one-tile gap or an area fill's chosen gap count as connected. Autofill is a best-effort placement heuristic, not a proof of a globally optimal layout. Fixed assignments or a shortage of neighboring seats may split groups; the actual result names affected groups. Group status also shows whether its placed members are connected.

The **Remove all players from Hive** button at the bottom of the right panel clears assignments only, including beacon players. It retains the roster, group memberships, all map objects and reference coordinates. Undo restores the assignments. It is disabled when no bases are assigned.

## Adding objects with hotkeys

Press **B** for a base, **M** for Marshall, **A** for the Alliance Center, **T** for terrain, or **L** for a beacon, then click the desired position. Button hover titles and map-object tooltips show the shortcuts in the active language. Shortcuts do not run while entering text, using dialogs, dragging, composing characters or holding Ctrl/Command/Alt; they ignore automatic key repeats. A and L follow the existing Season-4 restriction. M and A select an existing unique object when already present. Escape cancels placement.

## Terrain

Select terrain to enter the world X/Y of its **bottom-left corner** in the right panel. For example, a 5×5 area placed at X820/Y920 extends rightward and upward from exactly that corner. Rectangular terrain works the same way. Half-tile coordinates are supported so previously saved geometry can retain its exact edges. Changing width or height in the panel keeps this corner fixed.

Selected, unconnected terrain shows four outward-facing corner arrow handles. Dragging a corner fixes the opposite corner, previews the dimensions, and snaps both dimensions to whole tiles (1–60 each). Red previews indicate blocked placements; releasing an invalid resize leaves the original geometry intact. A focused corner handle also accepts arrow keys, with Shift for five tiles. Terrain may overlap other terrain; buildings may overlap neither terrain nor buildings. Overlapping terrain can be selected through the right-panel terrain selector.

Select touching or overlapping terrain pieces with Ctrl/Command-click or a selection box, then choose **Connect terrain** in the right panel. They become one selectable, movable shape with a shared name and a continuous outline. Cutouts and holes remain empty and can contain buildings. Positioning a connected shape uses the bottom-left corner of its outer bounding rectangle. **Disconnect terrain** restores individual editing and corner resizing. Joining, separating, moving and deleting a shape are each one undo step.

## Map selection and area fill

The map toolbar offers **Pan view**, **Multi-select** and **Fill area**. Ctrl/Command-click adds or removes objects from the selection. Shift-drag starts a selection box from anywhere; in Multi-select mode, drag from empty space. Only fully enclosed pieces are selected, and a connected terrain shape is always selected as a whole. Drag any selected object to move the selection together, use arrow keys (Shift for five tiles), or enter X/Y offsets in the inspector. A collision cancels the entire move. Moving a selected coordinate reference retains its entered world coordinate, as with individual movement.

Choose **Fill area**, draw a rectangle and select **0, 1 or 2 tiles** between bases. The preview shows whole 3×3 bases that fit inside the rectangle, excluding terrain, existing buildings and the requested gap around existing bases. **Create bases** inserts the preview in one undoable step, up to the existing 800-object plan limit. This creates empty seats; **Autofill** then assigns players using their existing priorities and friend groups. Escape or Cancel discards the preview.

## Persistence and validation

Plans are stored in explicit JSON files, not browser or cloud storage. Only the interface language is remembered on the device. Version-4 plans additionally store terrain connections, exact terrain geometry and per-base area-fill spacing. Version-3 plans retain season, groups, player priorities and custom priority labels. Version-2 plans retain their season, groups, geometry and assignments and migrate all players to P2. Version-1 plans migrate to Season 4 with empty groups and P2 players, retaining names, geometry and assignments. Switching language preserves plan data and history; default map labels, help, errors and image/CSV export labels use the active language. Player names and custom labels stay as entered. CSV exports include group membership, numeric priority and its label.

Names are escaped in SVG/HTML, and CSV exports guard spreadsheet formula prefixes. JSON imports validate schema, season rules, memberships, priorities, priority labels, assignments, geometry and collisions before changing the plan.

Run the automated checks from the project root:

```
node --check dist/i18n.js
node --check dist/model.js
node --check dist/app.js
node test/model.test.cjs
node test/season-groups.test.cjs
node test/priority.test.cjs
node test/map-editing.test.cjs
node test/i18n.test.cjs
```

These cover layout geometry, imports, all season modes, priority-aware grouped autofill, averages competing with individuals, fixed anchors, split-group reporting, exact bottom-left terrain placement, union outlines and holes, terrain connections and persistence, atomic multiple-object movement, all three fill spacings, obstacle avoidance and object limits, clearing with intact undo snapshots, legacy file migration, and all 369 localized messages in seven languages. Interface bindings and local assets were statically audited. Browser interaction and visual checks were not run in this update.

Optional WebMCP tools register only when `document.modelContext` supports them and use the same model and state as the visible planner. Their browser registration has not been tested.
