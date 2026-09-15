# User-facing version numbers

The user requires a version number at the bottom of the planner, starting with
1.1.2 for the release that adds hotkeys and clearing Hive assignments.

For each subsequent delivered change, increment only the final numeric segment
of `APP_VERSION` in `dist/app.js` once (1.1.3, 1.1.4, ...). Intermediate edits and
verification within the same release do not require additional increments.
Apply the same release to the hosted Site and the standalone HTML file, and
update the release noted in README.md. Keep the JSON plan schema version in
`dist/model.js` independent; it is not the user-facing application version.
