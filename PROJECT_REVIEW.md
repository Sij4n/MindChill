# Project status

[← README](README.md) · [Development](docs/DEVELOPMENT.md) · [Music sources](MUSIC_SOURCES.md)

Updated 17 October 2026. This page distinguishes implemented behavior from remaining work.

## Implemented

- An open workspace with translucent controls and sage, rose, or lavender accents.
- Seven music selections across six genres, source links, status messages, and retry/next-station recovery.
- A reused YouTube player for station changes, guarded commands, and an initial connection timeout.
- Six external GIF scenes, an explicit next-scene control, and a still-gradient fallback. The removed cat scene is absent; saved presets that referenced it migrate to Rainy Window.
- Three starter atmosphere presets and up to six personal scene/audio presets.
- Adjustable focus sessions, fixed short/long breaks, pause/reset, and deadline-based background catch-up.
- A session intention, daily goal, completed-session history, and compact running countdown.
- Persistent tasks with filters and a task-to-focus action.
- An autosaving scratchpad with word count and plain-text export.
- An optional display name and preferences stored locally.
- Shared focus-managed dialogs for Focus, Tasks, Notes, personalization, About, and Scenes & sounds.
- A separate one-to-one PeerJS study-room interface.

The center stays clear of a permanent productivity dashboard. Detailed tools appear in panels.

## Verification and screenshots

The code update passed the production build, ESLint, and 19 regression tests. Those tests cover preference recovery, dialog focus, timer continuity and completion, presets, genre selection, player failure handling, removed-scene migration, notes, and task-to-intention flow.

Six sources reached the embedded player's **Now playing** state during the last recorded audit; the [source log](MUSIC_SOURCES.md) lists exactly what was checked. Integration tests mock YouTube and the study-room component, so passing tests alone do not establish media availability or peer connectivity.

Fresh [screenshots](docs/screenshots/README.md) document the current desktop and mobile UI. They use sample content and the still scene. Live study-call connectivity was not tested as part of those captures.

## Current limitations

| Area | Current behavior |
| --- | --- |
| Active timer | Closing Focus preserves it; refreshing or closing the page resets it. |
| Storage | Browser-local only; no account sync, cloud backup, or cross-tab synchronization. |
| Backup | Notes export is available. Tasks, presets, and session history have no import/export flow. |
| External media | YouTube embedding, regional availability, remote GIFs, and network access can change. |
| Together | One-to-one calls only; no shared timer, tasks, or notes. Incoming calls can be answered automatically. |
| Call lifecycle | Pending media requests may resolve after closing. Fallback room codes and network failure recovery need work. |
| Network traversal | STUN is configured, but no TURN relay is configured for restrictive networks. |
| Accessibility | Together uses separate modal behavior and does not yet match every shared Dialog interaction. |
| Showcase | The optional promo presentation can lag behind the normal workspace and is not a screenshot source. |

## Suggested next work

1. Improve study-room consent, pending-request cleanup, fallback room codes, timeout/retry states, and dialog behavior.
2. Restore interrupted focus sessions after refresh with an explicit resume decision.
3. Add export/import for important local data and a small weekly review of completed sessions.
4. Explore opt-in ambient sound mixing and completion sounds.
5. Modernize the build tooling in a separate, tested change.

These items are planned improvements, not existing features.
