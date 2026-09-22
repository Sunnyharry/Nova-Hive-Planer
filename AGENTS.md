# User-facing version numbers

The user requires a version number at the bottom of the planner, starting with
1.2.0 for the stable workspace redesign requested by the user.

For each subsequent delivered change, increment only the final numeric segment
of `APP_VERSION` in `dist/app.js` once (1.2.1, 1.2.2, ...). Intermediate edits and
verification within the same release do not require additional increments.
Apply the same release to the hosted Site and the standalone HTML file, and
update the release noted in README.md. Keep the JSON plan schema version in
`dist/model.js` independent; it is not the user-facing application version.

# GitHub mirror

The user authorized additionally updating `Sunnyharry/Nova-Hive-Planer` for each
delivered change. Preserve its current visibility. Keep editable source files
and the root `nova-hive-planner.html` standalone build in sync with each release.
The GitHub mirror has separate history from the Sites source repository;
preserve unrelated files and do not copy `.openai/hosting.json` there.
