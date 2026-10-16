# Music sources and playback verification

[← README](README.md) · [Troubleshooting](docs/TROUBLESHOOTING.md#music-will-not-play) · [Catalog](src/components/MusicPlayer/mediaCatalog.js)

The catalog in `mediaCatalog.js` is the source of truth. There are seven selections across six genres. Entries may be individual tracks, recorded mixes, or streams; they are not all continuous live radio.

## Last recorded playback audit: 17 October 2026

“Embedded playback” means the selection reached the app player's **Now playing** state during a manual check. It does not promise future or worldwide availability.

| Selection | Genre | Source / publisher | Check |
| --- | --- | --- | --- |
| I Have No Enemies | Lo-fi | [Nazrak](https://www.youtube.com/watch?v=12ha6PMB1PE) | Public metadata checked; not part of the completed embedded-playback audit. |
| Resonance | Chillwave | [Electronic Gems / HOME](https://www.youtube.com/watch?v=8GW6sLrK40k) | Embedded playback. |
| Jazz Vibes | Jazz | [Cafe Music BGM channel](https://www.youtube.com/watch?v=Dx5qFachd3A) | Embedded playback. |
| Synthwave Radio | Synthwave | [Lofi Girl](https://www.youtube.com/watch?v=4xDzrJKXOOY) | Embedded playback. |
| Peaceful Piano | Piano | [Soothing Relaxation](https://www.youtube.com/watch?v=HhEB7UpYbyw) | Embedded playback. |
| Ambient Drift | Ambient | [Brian Eno](https://www.youtube.com/watch?v=OlaTeXX3uH8) | Embedded playback. |
| Lo-fi Study | Lo-fi | [Lofi Girl — 1 A.M Study Session](https://www.youtube.com/watch?v=lTRiuFIWV54) | Embedded playback. |

The corrected piano source also reached **Now playing** during documentation screenshot capture. Screenshot capture is not a new audit of every catalog entry.

## Replaced links

| Previous video ID | Reason for replacement |
| --- | --- |
| `WTeolI19oOI` | Reported broken Resonance source; replaced with the Electronic Gems upload. |
| `vMxYL4Cj85Y` | Former piano radio returned an embed restriction during testing. |
| `A_nRzRZQqv0` | Former dark ambient radio returned an embed restriction during testing. |
| `jfKfPfyJRdk` | Former lo-fi radio returned an embed restriction during testing. |

## Before changing a source

1. Confirm the source title and publisher, and retain attribution.
2. Select it in the running app and wait for actual embedded playback. A working watch page or oEmbed response alone is insufficient.
3. Check pause/resume, volume, mute, switching, replay, and error recovery.
4. Record the date, video ID, result, and any observed region/browser limitation here.
5. Preserve catalog array positions or migrate saved preferences and presets; see [development notes](docs/DEVELOPMENT.md#change-music-or-scenes).

The app offers retry, next-station, and source-link controls when playback fails. It does not bypass YouTube restrictions. Music rights remain with the respective owners; the application's MIT license does not license the music.
