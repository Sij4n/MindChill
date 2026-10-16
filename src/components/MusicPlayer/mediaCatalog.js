// Keep existing station positions stable for saved preferences and presets.
export const MUSIC_STREAMS = [
  { id: 1, name: 'I Have No Enemies', genre: 'Lo-fi', videoId: '12ha6PMB1PE', description: 'Soft beats for a quieter day', artist: 'Nazrak' },
  { id: 2, name: 'Resonance', genre: 'Chillwave', videoId: '8GW6sLrK40k', description: 'HOME · nostalgic, dreamy electronics', artist: 'Electronic Gems' },
  { id: 3, name: 'Jazz Vibes', genre: 'Jazz', videoId: 'Dx5qFachd3A', description: 'Warm coffee-shop jazz', artist: 'Cafe Music BGM channel' },
  { id: 4, name: 'Synthwave Radio', genre: 'Synthwave', videoId: '4xDzrJKXOOY', description: 'Retro synths for late-night flow', artist: 'Lofi Girl' },
  { id: 5, name: 'Peaceful Piano', genre: 'Piano', videoId: 'HhEB7UpYbyw', description: 'Gentle keys for reading and study', artist: 'Soothing Relaxation' },
  { id: 6, name: 'Ambient Drift', genre: 'Ambient', videoId: 'OlaTeXX3uH8', description: 'Brian Eno · An Ending (Ascent)', artist: 'Brian Eno' },
  { id: 7, name: 'Lo-fi Study', genre: 'Lo-fi', videoId: 'lTRiuFIWV54', description: '1 A.M Study Session · an hour of mellow beats', artist: 'Lofi Girl' }
];

export const BACKDROP_GIFS = [
    {
        id: 1,
        name: 'Rainy Window',
        url: 'https://media.giphy.com/media/13EgsbsNCLHXJm/giphy.gif'
    },
    {
        id: 2,
        name: 'Cozy Room',
        url: 'https://media.giphy.com/media/AKI06qGNgli48/giphy.gif'
    },
    {
        id: 3,
        name: 'City Night',

        url: 'https://media.giphy.com/media/X5Fi1MfRk0F44/giphy.gif'
    },
    {
        id: 4,
        name: 'Pixel Rain',
        url: 'https://media.giphy.com/media/ld0KuyVjTQnQO7EMc2/giphy.gif'
    },
    {
        id: 5,
        name: 'Sunset Drive',
        url: 'https://media.giphy.com/media/tkaDAjbZUmoH1a1Z2R/giphy.gif'
    },
    {
        id: 6,
        name: 'Clove',
        url: 'https://media.giphy.com/media/Am8zitLeNJlxlXarDT/giphy.gif'
    },
];



export const validIndex = (value, list) => Number.isInteger(value) && value >= 0 && value < list.length;
export const validPreset = value => value && typeof value.id === 'string' && typeof value.name === 'string' && value.name.length <= 40 && validIndex(value.stream, MUSIC_STREAMS) && validIndex(value.backdrop, BACKDROP_GIFS) && Number.isFinite(value.volume) && value.volume >= 0 && value.volume <= 100 && typeof value.muted === 'boolean' && typeof value.still === 'boolean';
// The removed cat was the final scene (index 6). Keep its saved setups with a rainy window.
export const migratePresets = value => Array.isArray(value) ? value.map(preset => preset?.backdrop === 6 ? { ...preset, backdrop: 0 } : preset).filter(validPreset).slice(0, 6) : [];
export const playbackError = code => {
  if (code === 100) return 'This video is no longer available. Try another station.';
  if (code === 101 || code === 150) return 'This station cannot play here. Open it on YouTube or choose another.';
  if (code === 153) return 'YouTube could not verify this player. Try again or open the source on YouTube.';
  if (code === 2) return 'This station has an invalid video link. Choose another station.';
  return 'The music could not load. Check your connection, retry, or choose another station.';
};
