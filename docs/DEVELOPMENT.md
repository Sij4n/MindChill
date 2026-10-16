# Development

[← README](../README.md) · [Contributing](../CONTRIBUTING.md)

## Setup and commands

The checked-in application is a client-side React 19 app built with Create React App (`react-scripts` 5). The verified local toolchain is Node.js 25.1.0 and npm 11.6.2. No application API keys or `.env` file are required for the current setup.

```bash
npm ci
npm start
```

Use the lockfile for a reproducible install. The development server normally uses port 3000. There is no `dev` script.

To choose another port in PowerShell:

```powershell
$env:PORT = '3001'
$env:BROWSER = 'none'
npm start
```

On a POSIX shell:

```bash
PORT=3001 BROWSER=none npm start
```

Environment variables affect the current shell session. Stop the server with Ctrl+C; unset/reset those variables afterward if you want the defaults back.

## Source map

```text
public/
  index.html                 Welcome screen and HTML shell
  manifest.json              Browser app metadata
src/
  App.js                     Toolbar, panel routing, theme, intention, goal
  App.css                    Workspace layout and shared panel styles
  index.css                  Global tokens, fonts, reset, reduced-motion rules
  useStoredState.js          Validated local storage and optional migrations
  useFocusTimer.js           Deadline-based timer and completed-session history
  components/
    Dialog.jsx               Portal-based shared modal and focus management
    MusicPlayer/
      MusicPlayer.jsx        Playback lifecycle, genres, presets, scenes
      mediaCatalog.js        Station/backdrop catalog and preset migration
    PomodoroTimer/           Timer panel; receives the shared timer from App
    TodoList/                Task storage, filters, completion, focus callback
    Scratchpad.jsx           Autosaved notes and plain-text export
    Scratchpad.css
    VideoCall/               PeerJS one-to-one study room
    PromoVideo/              Existing feature showcase at ?promo=true
  App.test.js                Integration and player behavior regressions
  useFocusTimer.test.js      Deadline, pause, completion, long-break tests
docs/
  USER_GUIDE.md
  DEVELOPMENT.md
  TROUBLESHOOTING.md
  screenshots/               Repository-local UI screenshots
```

## State and lifecycle

`App` owns the open-panel state, personalization, intention, daily goal, and shared timer. Closing Focus hides its dialog; it does not destroy the timer hook. Selecting a task calls `onFocusTask`, copies up to 160 characters into the intention, and opens Focus without starting or resetting the timer.

`useFocusTimer` stores the active mode, duration, remaining seconds, and optional deadline in memory. While running, a 250 ms interval updates the clock; `visibilitychange` catches up after background throttling. Completion uses the deadline to prevent double recording. Work completions append `{ day, minutes }` using the browser's local date, retaining the latest 1,000 records. Breaks do not count toward the goal. The active countdown is not persisted across refreshes.

`MusicPlayer` keeps a YouTube player instance for station changes and issues guarded player commands. Retrying a failed player recreates it. It exposes connection, buffering, playback, and error states, with a 15-second initial connection timeout. Stations are loaded from `mediaCatalog.js`; external media is not downloaded or bundled.

`Dialog` portals standard panels to the document body, traps Tab focus, closes on Escape or overlay click, and restores focus. Theme variables are set on the document root so portaled panels inherit the accent. `VideoCall` uses a separate modal and lifecycle; see [known limitations](../PROJECT_REVIEW.md).

## Local data

All values are JSON-encoded in `localStorage`. `useStoredState` reads once on mount, validates stored values, applies an optional migration, and writes on state changes. Invalid JSON/values use the fallback. Storage errors are caught so the app can still run, but persistence is unavailable if the browser blocks storage.

| Storage key | Value |
| --- | --- |
| `mindchill-stream` | Station array index |
| `mindchill-backdrop` | Backdrop array index |
| `mindchill-volume` | Number, 0–100 |
| `mindchill-muted` | Boolean |
| `mindchill-still-scene` | Boolean |
| `mindchill-presets` | Up to six `{ id, name, stream, backdrop, volume, muted, still }` objects |
| `mindchill-todos` | Task objects with id, text, completed flag, and creation date |
| `mindchill-scratchpad` | String, up to 20,000 characters |
| `mindchill-name` | String, up to 30 characters |
| `mindchill-intention` | String, up to 160 characters |
| `mindchill-daily-goal` | Goal in minutes |
| `mindchill-theme` | `sage`, `rose`, or `lavender` |
| `mindchill-focus-minutes` | Integer, 1–120 |
| `mindchill-focus-history` | Completed `{ day, minutes }` records |

These keys belong to the browser origin. `localhost:3000`, `localhost:3001`, and `127.0.0.1:3000` have separate stores. There is no shared storage-event synchronization between tabs, cloud sync, or account database.

## Change music or scenes

1. Edit `src/components/MusicPlayer/mediaCatalog.js`.
2. Preserve existing array positions where possible: preferences and presets store indexes, not catalog IDs.
3. If removing/reordering an entry, migrate saved indexes and add regression coverage. The removed cat scene at index 6 is migrated to Rainy Window for saved presets; an invalid selected-backdrop index falls back to zero.
4. Test music in the app until the embedded player actually reaches **Now playing**. Checking a watch page or oEmbed response alone is insufficient.
5. Confirm mute, volume, pause, replay, station switching, and failure recovery. Check media attribution and update [MUSIC_SOURCES.md](../MUSIC_SOURCES.md).
6. For scene changes, test image-load failure and the user's explicit animated-scene choice under reduced motion.

Station `id`, `name`, `genre`, `videoId`, `description`, and `artist` fields describe the selections. Backdrops use `id`, `name`, and `url`. Do not put secrets in the catalog or client environment variables.

## Validate changes

```bash
npm run lint
npm test -- --watchAll=false --runInBand
npm run build
```

For CI shells, set `CI=true` as appropriate. The current suite contains 19 tests covering local data, panel focus, timer behavior, presets, genre selection, player failures, removed-scene migration, notes, and task-to-intention flow. Keep this count in sync if documenting later changes.

YouTube and the study-room component are mocked in integration tests. Passing tests do not establish remote video availability, audible playback, camera permission behavior, or peer connectivity. Validate those integrations separately where they change.

For UI changes, check desktop and a narrow phone layout, keyboard focus, scrolling inside long panels, and reduced motion. Update [screenshots](screenshots/README.md) when visible behavior changes.

## Build and host

`npm run build` writes static production assets to `build/`, which is ignored by Git. Serve that directory with a static host and an `index.html` fallback. Configure the public URL/base path before building if deploying under a subdirectory.

Use HTTPS on a public deployment, especially for camera/microphone access. Music, GIFs, fonts, PeerJS signaling, and STUN connectivity use external services; the app does not include an offline media cache or a custom backend.

The optional `?promo=true` showcase is a timed presentation, not the normal workspace. It can drift from the product UI, so it is not the source for documentation screenshots.
