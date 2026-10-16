import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX, Shuffle, Headphones, Image, ChevronRight, Bookmark, Plus, Trash2, Check } from 'lucide-react';
import YouTube from 'react-youtube';
import useStoredState from '../../useStoredState';
import Dialog from '../Dialog';
import './MusicPlayer.css';

import { MUSIC_STREAMS, BACKDROP_GIFS, validIndex, validPreset, migratePresets, playbackError } from './mediaCatalog';

const STARTER_PRESETS = [
  { id: 'rain', name: 'Rainy day reading', stream: 0, backdrop: 0, volume: 35, muted: false, still: false },
  { id: 'cafe', name: 'Coffee & a fresh page', stream: 2, backdrop: 1, volume: 45, muted: false, still: false },
  { id: 'night', name: 'After hours', stream: 1, backdrop: 2, volume: 30, muted: false, still: false }
];
function MusicPlayer({ autoPlay, showSettingsInitially = false }) {
  const [currentStreamIndex, setCurrentStreamIndex] = useStoredState('mindchill-stream', 0, v => validIndex(v, MUSIC_STREAMS));
  const [currentBackdropIndex, setCurrentBackdropIndex] = useStoredState('mindchill-backdrop', 0, v => validIndex(v, BACKDROP_GIFS));
  const [volume, setVolume] = useStoredState('mindchill-volume', 50, v => Number.isFinite(v) && v >= 0 && v <= 100);
  const [isMuted, setIsMuted] = useStoredState('mindchill-muted', false, v => typeof v === 'boolean');
  const [still, setStill] = useStoredState('mindchill-still-scene', window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false, v => typeof v === 'boolean');
  const [presets, setPresets] = useStoredState('mindchill-presets', [], v => Array.isArray(v) && v.length <= 6 && v.every(validPreset), migratePresets);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(showSettingsInitially);
  const [presetName, setPresetName] = useState('');
  const [notice, setNotice] = useState('');
  const [playerError, setPlayerError] = useState('');
  const [genre, setGenre] = useState('All');
  const [retryCount, setRetryCount] = useState(0);
  const [playbackState, setPlaybackState] = useState('loading');
  const [ready, setReady] = useState(false);
  const [backdropFailed, setBackdropFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false);
  const playerRef = useRef(null);
  const initialVideoId = useRef(MUSIC_STREAMS[currentStreamIndex].videoId);
  const wantsPlayback = useRef(autoPlay);
  const loadedVideoId = useRef(MUSIC_STREAMS[currentStreamIndex].videoId);
  const runPlayerCommand = useCallback((method, ...args) => {
    const player = playerRef.current;
    if (!player || typeof player[method] !== 'function') return;
    const failed = () => { setIsPlaying(false); setPlaybackState('error'); setPlayerError(playbackError(5)); };
    try {
      const result = player[method](...args);
      if (result && typeof result.catch === 'function') result.catch(failed);
    } catch { failed(); }
  }, []);
  const closeSettings = useCallback(() => setShowSettings(false), []);
  const currentStream = MUSIC_STREAMS[currentStreamIndex];
  const currentBackdrop = BACKDROP_GIFS[currentBackdropIndex];
  useEffect(() => {
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const changed = event => setReduceMotion(event.matches);
    preference?.addEventListener?.('change', changed);
    return () => preference?.removeEventListener?.('change', changed);
  }, []);
  useEffect(() => { setBackdropFailed(false); }, [currentBackdropIndex]);
  const onPlayerReady = event => {
    playerRef.current = event.target;
    runPlayerCommand('setVolume', volume);
    runPlayerCommand(isMuted ? 'mute' : 'unMute');
    loadedVideoId.current = initialVideoId.current;
    setPlayerError(''); setPlaybackState('ready'); setReady(true);
  };
  useEffect(() => {
    if (!ready || !(autoPlay || wantsPlayback.current)) return;
    wantsPlayback.current = true;
    setPlayerError(''); setPlaybackState('loading');
    if (loadedVideoId.current !== currentStream.videoId) {
      loadedVideoId.current = currentStream.videoId;
      runPlayerCommand('loadVideoById', currentStream.videoId);
    } else runPlayerCommand('playVideo');
  }, [autoPlay, ready, currentStream.videoId, runPlayerCommand]);
  useEffect(() => { runPlayerCommand('setVolume', volume); }, [volume, runPlayerCommand]);
  useEffect(() => { runPlayerCommand(isMuted ? 'mute' : 'unMute'); }, [isMuted, runPlayerCommand]);
  useEffect(() => {
    if (ready || playbackState === 'error') return;
    const timeout = setTimeout(() => setPlayerError('YouTube is taking too long to connect. Retry or choose another station.'), 15000);
    return () => clearTimeout(timeout);
  }, [ready, retryCount, currentStreamIndex, playbackState]);
  const retryPlayback = () => {
    wantsPlayback.current = true;
    setPlayerError(''); setIsPlaying(false); setReady(false); setPlaybackState('loading'); playerRef.current = null;
    setRetryCount(previous => previous + 1);
  };
  const selectStream = index => {
    wantsPlayback.current = true;
    setPlayerError(''); setIsPlaying(false); setPlaybackState('loading');
    if (index === currentStreamIndex && ready) runPlayerCommand('loadVideoById', MUSIC_STREAMS[index].videoId);
    setCurrentStreamIndex(index);
  };
  const nextStation = () => selectStream((currentStreamIndex + 1) % MUSIC_STREAMS.length);
  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    wantsPlayback.current = !isPlaying;
    runPlayerCommand(isPlaying ? 'pauseVideo' : 'playVideo');
  }, [isPlaying, runPlayerCommand]);
  const nextScene = useCallback(() => { setCurrentBackdropIndex(previous => (previous + 1) % BACKDROP_GIFS.length); setStill(false); }, [setCurrentBackdropIndex, setStill]);
  useEffect(() => {
    const handleKey = e => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="dialog"]')) return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.key.toLowerCase() === 'm') setIsMuted(previous => !previous);
      if (e.key.toLowerCase() === 'g') nextScene();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [togglePlay, nextScene, setIsMuted]);
  const opts = useMemo(() => ({ height: '200', width: '200', playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, rel: 0, origin: window.location.origin } }), []);
  const applyPreset = preset => {
    selectStream(preset.stream); setGenre('All'); setCurrentBackdropIndex(preset.backdrop); setVolume(preset.volume); setIsMuted(preset.muted); setStill(preset.still);
    setNotice(`Welcome to ${preset.name.toLowerCase()}.`);
  };
  const savePreset = e => {
    e.preventDefault();
    if (!presetName.trim() || presets.length >= 6) return;
    setPresets(previous => [...previous, { id: String(Date.now()), name: presetName.trim(), stream: currentStreamIndex, backdrop: currentBackdropIndex, volume, muted: isMuted, still }]);
    setPresetName(''); setNotice('Your little corner is saved.');
  };
  const quietScene = still;
  const genres = ['All', ...new Set(MUSIC_STREAMS.map(stream => stream.genre))];
  const errorControls = <><p>{playerError}</p><div className="playback-error-actions"><button onClick={retryPlayback}>Retry playback</button><button onClick={nextStation}>Next station</button><a href={`https://www.youtube.com/watch?v=${currentStream.videoId}`} target="_blank" rel="noreferrer">Open on YouTube ↗</a></div></>;
  return <div className="music-player-fullscreen" role="region" aria-label="Music player — background and controls">
    <div className="fullscreen-backdrop">{!quietScene && !backdropFailed && <img key={currentBackdrop.id} src={currentBackdrop.url} alt="" className="scene-image" onError={() => setBackdropFailed(true)} />}<div className="backdrop-gradient" /></div>
    <div className="youtube-container" aria-hidden="true"><YouTube key={retryCount} videoId={initialVideoId.current} opts={opts} onReady={onPlayerReady} onEnd={() => { if (wantsPlayback.current) runPlayerCommand('playVideo'); }} onStateChange={event => { if (playerError && event.data !== 1) return; if (event.data === 1) { setIsPlaying(true); setPlayerError(''); setPlaybackState('playing'); } else if (event.data === 3) setPlaybackState('buffering'); else if ([0,2,-1,5].includes(event.data)) { setIsPlaying(false); setPlaybackState(event.data === 2 ? 'paused' : 'ready'); } }} onError={event => { setIsPlaying(false); setPlaybackState('error'); setPlayerError(playbackError(event.data)); }} /></div>
    <div className="lofi-controls-container glass-card">
      <span className={`record-art ${isPlaying ? 'spinning' : ''}`} aria-hidden="true"><Headphones size={20} /></span>
      <div className="now-playing"><span>{playbackState === 'loading' ? 'CONNECTING…' : playbackState === 'buffering' ? 'BUFFERING…' : playbackState === 'error' ? 'UNAVAILABLE' : isPlaying ? 'NOW PLAYING' : 'YOUR SOUNDTRACK'}</span><strong>{currentStream.name}</strong></div>
      <button className="music-control-btn play-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'} aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? <Pause size={18} /> : <Play size={18} />}</button>
      <button className="music-control-btn shuffle-btn" title="Shuffle station" aria-label="Shuffle station" onClick={() => selectStream((currentStreamIndex + 1 + Math.floor(Math.random() * (MUSIC_STREAMS.length - 1))) % MUSIC_STREAMS.length)}><Shuffle size={16} /></button>
      <div className="volume-control-group"><button className="music-control-btn volume-btn" title={isMuted ? 'Unmute' : 'Mute'} aria-label={isMuted ? 'Unmute' : 'Mute'} aria-pressed={isMuted} onClick={() => setIsMuted(previous => !previous)}>{isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button><input type="range" className="volume-slider" aria-label="Volume" min="0" max="100" value={isMuted ? 0 : volume} onChange={e => { setVolume(Number(e.target.value)); if (Number(e.target.value) > 0) setIsMuted(false); }} /></div>
    </div>
    <div className="scene-controls glass-card"><button className="settings-toggle" aria-label="Toggle settings" aria-expanded={showSettings} onClick={() => setShowSettings(true)}><Image size={17} /><span><small>SCENES & SOUNDS</small>{quietScene ? 'Stillness' : backdropFailed ? 'Scene unavailable' : currentBackdrop.name}</span></button><button className="music-control-btn" aria-label="Next scene" title="Next scene" onClick={nextScene}><ChevronRight size={18} /></button></div>
    {playerError && !showSettings && <div className="player-error glass-card" role="status">{errorControls}</div>}
    <Dialog open={showSettings} onClose={closeSettings} label="Scenes & sounds" className="settings-dialog">
      <section className="settings-panel glass-card"><div className="panel-heading"><span className="eyebrow">SET THE MOOD</span><h2>Your kind of atmosphere.</h2><p>A familiar place. A favorite sound.</p></div>
        <div className="settings-section"><h3><Bookmark size={15} /> Start with a feeling</h3><div className="starter-presets">{STARTER_PRESETS.map((preset,index) => <button key={preset.id} className={`starter-preset preset-${index}`} onClick={() => applyPreset(preset)}><span>0{index + 1}</span><strong>{preset.name}</strong><small>{MUSIC_STREAMS[preset.stream].name} · {preset.volume}% volume</small></button>)}</div></div>
        <div className="settings-section"><h3><Headphones size={15} /> Music Stream <small>{MUSIC_STREAMS.length} stations</small></h3>
          <div className="genre-filters" role="group" aria-label="Music genres">{genres.map(value => <button key={value} aria-label={`${value} genre`} aria-pressed={genre === value} onClick={() => setGenre(value)}>{value}</button>)}</div>
          <div className="stream-options">{MUSIC_STREAMS.map((stream,index) => (genre === 'All' || genre === stream.genre) && <button className={`stream-btn ${currentStreamIndex === index ? 'active' : ''}`} key={stream.id} aria-label={stream.name} aria-pressed={currentStreamIndex === index} onClick={() => selectStream(index)}><span><strong>{stream.name}</strong><small>{stream.genre} · {stream.description}</small></span>{currentStreamIndex === index && <Check size={14} />}</button>)}</div>
          <a className="station-source" href={`https://www.youtube.com/watch?v=${currentStream.videoId}`} target="_blank" rel="noreferrer">Current source: {currentStream.artist} · Open on YouTube ↗</a>
          {playerError && showSettings && <div className="inline-player-error" role="status">{errorControls}</div>}
        </div>
        <div className="settings-section">{backdropFailed && !quietScene && <p className="scene-load-error" role="status">This GIF could not load. Choose another scene or <button onClick={() => setBackdropFailed(false)}>try again</button>.</p>}<h3><Image size={15} /> Choose a scene</h3><div className="backdrop-options">{BACKDROP_GIFS.map((backdrop,index) => <button key={backdrop.id} className={`backdrop-btn ${currentBackdropIndex === index ? 'active' : ''}`} onClick={() => {setCurrentBackdropIndex(index); setStill(false);}} aria-pressed={currentBackdropIndex === index && !quietScene} aria-label={backdrop.name} style={{backgroundImage: quietScene ? 'none' : `url(${backdrop.url})`}}><span>{backdrop.name}</span></button>)}</div><label className="still-toggle"><span>Still scene<small>A soft gradient, without animation{reduceMotion ? ' · suggested by your motion preference' : ''}</small></span><input type="checkbox" aria-label="Still scene" checked={quietScene} onChange={e => setStill(e.target.checked)} /></label></div>
        <div className="settings-section"><h3><Bookmark size={15} /> Your saved corners <small>{presets.length}/6</small></h3><form className="preset-form" onSubmit={savePreset}><input aria-label="Preset name" maxLength={40} value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="Name this setup…" /><button className="secondary-action" type="submit" disabled={!presetName.trim() || presets.length >= 6}><Plus size={15} />Save</button></form>{presets.length === 0 && <p className="panel-footnote">Save the current scene, station, and volume to return to later.</p>}<div className="saved-presets">{presets.map(preset => <div key={preset.id}><button onClick={() => applyPreset(preset)}><Bookmark size={14} />{preset.name}</button><button aria-label={`Delete ${preset.name}`} onClick={() => {setPresets(previous => previous.filter(item => item.id !== preset.id)); setNotice('Preset removed.');}}><Trash2 size={15} /></button></div>)}</div></div>
        {notice && <p role="status" className="completion-note">{notice}</p>}
      </section>
    </Dialog>
  </div>;
}
export default React.memo(MusicPlayer);
