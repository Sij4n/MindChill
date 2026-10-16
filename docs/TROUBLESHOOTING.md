# Troubleshooting

[← README](../README.md) · [User guide](USER_GUIDE.md)

## The start command fails

Use `npm start`, not `npm run dev`. Run it from the folder containing `package.json` after `npm ci`.

If port 3000 is occupied, stop the server you previously started with Ctrl+C, or set `PORT` in your shell before starting again. See [development setup](DEVELOPMENT.md#setup-and-commands). Avoid running several copies accidentally.

An outdated Browserslist-data warning or a development-server deprecation warning is different from a build failure. Check the command's final exit status and error output when reporting an issue.

## Music will not play

1. Dismiss the welcome screen and press **Play**. The browser may block automatic playback until a user gesture.
2. Check the app's mute control and volume, browser-tab mute, and device output.
3. Allow the player to finish connecting/buffering. On failure, use **Retry playback** or **Next station**.
4. Use the station's **Open on YouTube** link. If it plays there but not in the app, embedding or regional restrictions may be involved.
5. Check whether a content blocker or network rule is blocking YouTube.

A video can have a valid page and metadata while refusing embedded playback. Error handling distinguishes missing videos, embedding restrictions, player verification failures, and general loading errors. The app does not bypass those restrictions.

Use the latest [source audit](../MUSIC_SOURCES.md) when checking a broken station. Report the station name, source URL, country/region if relevant, browser, and the exact visible error. Do not include private browser data.

## The backdrop is a gradient

**Still scene** may be enabled. Open **Scenes & sounds**, select a GIF, or use the next-scene arrow. An initial reduced-motion preference suggests stillness, but an explicit scene choice enables the GIF.

If the panel reports a failed GIF load, retry or select another scene. Remote GIF hosting can fail independently of the app. A background click does not cycle scenes in the current interface; the next-scene control and `G` do.

## The timer reset or does not count minutes

Closing the Focus panel preserves the countdown. Refreshing or closing the page resets it; restoring interrupted sessions is not implemented yet. Switching modes also resets the countdown for the chosen mode.

Only fully completed focus sessions count toward daily progress. Breaks, unfinished sessions, and the remaining time of paused sessions do not count. A completed mode prepares the next one but waits for you to press Start.

The app uses the browser's local date for daily progress. A background tab catches up when active again, but a fully suspended or closed browser cannot display a live timer.

## Tasks, notes, or preferences disappeared

Use the same browser and origin. Changing the hostname or port creates a separate local-storage origin. Private browsing, cleared site data, blocked storage, or damaged saved JSON can also cause defaults to appear.

There is no account sync or cloud backup. Notes can be exported as plain text; tasks, presets, and history do not currently have an export/import flow. Avoid clearing site storage as a first troubleshooting step if you need its data.

## Study calls

Together needs camera and microphone access. Use localhost during development or HTTPS when hosted. Check permissions in the browser and close other apps that may be using the camera.

Both participants must keep the room open and use the current code. The implementation uses PeerJS signaling and public STUN servers; it does not configure a TURN relay, so some firewall/NAT combinations may prevent a connection.

Known limitations include automatic incoming-call answering, fallback room-code behavior, and media requests that can finish after a room has closed. See [project status](../PROJECT_REVIEW.md). Closing and reopening the room can help reinitialize it, but do not treat that as a guarantee of connectivity.

## Keyboard shortcuts do nothing

Click an unused part of the workspace first. Global shortcuts intentionally ignore text entry, buttons, links, and dialogs so typing does not start music or change scenes. Use the panel's own controls while it is open.

On phones, some toolbar labels and desktop controls are hidden; use the visible icons. Not every mobile browser supports fullscreen.

## Report a reproducible problem

Open an [issue](https://github.com/Sij4n/MindChill/issues) with the steps, expected and actual behavior, browser/OS, relevant visible error, and a screenshot if useful. Include whether it also happens after a reload, and whether another music source or scene works.
