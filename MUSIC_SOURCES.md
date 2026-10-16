# Music source checks — 17 October 2026

These sources were selected in the running app and reached the embedded player's “Now playing” state:

| Selection | Source | Publisher |
| --- | --- | --- |
| Resonance | https://www.youtube.com/watch?v=8GW6sLrK40k | Electronic Gems / HOME |
| Synthwave Radio | https://www.youtube.com/watch?v=4xDzrJKXOOY | Lofi Girl |
| Peaceful Piano | https://www.youtube.com/watch?v=HhEB7UpYbyw | Soothing Relaxation |
| Ambient Drift | https://www.youtube.com/watch?v=OlaTeXX3uH8 | Brian Eno |
| Lo-fi Study | https://www.youtube.com/watch?v=lTRiuFIWV54 | Lofi Girl |
| Jazz Vibes | https://www.youtube.com/watch?v=Dx5qFachd3A | Cafe Music BGM channel |

The existing “I Have No Enemies” source was retained; YouTube's public metadata returned its title and publisher (Nazrak). It was not included in the completed embedded-playback audit.

Replaced sources that returned embed errors during this check:

- vMxYL4Cj85Y — former piano radio
- A_nRzRZQqv0 — former dark ambient radio
- jfKfPfyJRdk — former lo-fi radio

The old Resonance link WTeolI19oOI was replaced with the Electronic Gems upload.

A successful metadata response alone is not an embedded-playback check. Future source updates should be tested by selecting the station in the app and confirming playback, not just by checking the watch page or oEmbed endpoint. Availability may differ by region or change later; retry, next-station, and source-link controls remain available when a source fails.
