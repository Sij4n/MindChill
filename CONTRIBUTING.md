# Contributing to Mind Chill

Help make the workspace calmer, more reliable, and easier to use. Start with the [README](README.md), [user guide](docs/USER_GUIDE.md), and [development notes](docs/DEVELOPMENT.md).

## Report a bug or suggest a feature

Search [existing issues](https://github.com/Sij4n/MindChill/issues) first. Include:

- Steps to reproduce and expected versus actual behavior.
- Browser, operating system, and viewport/device where relevant.
- The visible error, station/source URL, or scene name for media issues.
- A screenshot with personal notes, tasks, and room codes removed.

For feature proposals, explain the user need and how the feature fits a quiet music-and-focus workspace. Keep the center open; use panels for task management and detailed tools.

## Make a change

```bash
git clone https://github.com/YOUR_USERNAME/MindChill.git
cd MindChill
npm ci
git switch -c feature/your-change
npm start
```

Fork the repository before using the clone example, or use your authorized checkout. Keep changes focused and preserve existing behavior outside the task.

Before opening a pull request:

```bash
npm run lint
npm test -- --watchAll=false --runInBand
npm run build
```

Describe the problem, resulting behavior, validation, and any remaining limitation. Add current screenshots for visible UI changes, following the [screenshot guide](docs/screenshots/README.md).

## Implementation guidelines

- Use shared theme tokens, spacing, typography, and Dialog behavior where appropriate.
- Keep keyboard labels, visible focus, panel scrolling, and mobile layouts usable.
- Respect reduced motion while allowing explicit GIF selections.
- Keep local-storage keys stable. Migrate saved data when catalog positions or data shapes change.
- Add regression coverage for meaningful behavior changes, particularly timer completion, media failures, and saved-data migration.
- Keep notes, tasks, and preferences local unless a separately designed sync feature is introduced.
- Handle unavailable external services with visible recovery paths.

## Music and backdrop changes

Update the catalog and [music audit](MUSIC_SOURCES.md) together. A successful watch page or oEmbed response is not sufficient: test the source in the app and confirm the player reaches **Now playing**. Check pause/resume, volume, mute, switching, and failure recovery.

Retain attribution. Third-party music and GIF rights are separate from the application code's MIT license. Do not commit downloaded media without suitable rights.

Saved presets currently reference catalog array indexes. Preserve positions or implement a migration, as described in [development notes](docs/DEVELOPMENT.md#change-music-or-scenes).

## Commit messages and communication

Use a clear message such as `fix: handle unavailable music` or `docs: refresh workspace screenshots`. Explain what changed and why. Keep discussion respectful and focused on the work; use GitHub issues and pull requests rather than placeholder contact addresses.

## Documentation changes

Keep commands aligned with `package.json`; the current development command is `npm start`. Update README links, the user guide, source checks, and relevant screenshots when the interface or its behavior changes. Separate implemented behavior from planned improvements.
