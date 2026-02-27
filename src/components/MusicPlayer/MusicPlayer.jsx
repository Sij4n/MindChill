import React, { useState, useEffect, useRef, useCallback } from 'react';
import YouTube from 'react-youtube';
import './MusicPlayer.css';

// Curated lofi YouTube streams
const MUSIC_STREAMS = [
    {
        id: 1,
        name: 'I have no enimes ',
        videoId: '12ha6PMB1PE',
        description: 'beats to relax/study to'
    },
    {
        id: 2,
        name: 'Resonance',
        videoId: 'WTeolI19oOI',
        description: 'jazzy & lofi hip hop beats'
    },
    {
        id: 3,
        name: 'Jazz Vibes',
        videoId: 'Dx5qFachd3A',
        description: 'coffee shop jazz'
    }
];

// Aesthetic backdrop GIFs
const BACKDROP_GIFS = [
    {
        id: 1,
        name: 'Rainy Window',
        url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExenFmeTB0bGZpYmdoemdwcnR0ODZjYmd6bjA0Njdxa2w0MmEzZWRpOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13EgsbsNCLHXJm/giphy.gif'
    },
    {
        id: 2,
        name: 'Cozy Room',
        url: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmxjY21tMHQxNzN3YjFncGU5b2VjOG10cHNscnQ3enBlZWxvdjI3ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AKI06qGNgli48/giphy.gif'
    },
    {
        id: 3,
        name: 'City Night',

        url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb25iMmVsc3JscGY5YjFwdzBpb2p0anRyNG9mbzVhcm9ubG8wZWR6ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/X5Fi1MfRk0F44/giphy.gif'
    },
    {
        id: 4,
        name: 'Pixel Rain',
        url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExamJ6cHdjMzRtMmQ0NHR0dWFiZGEyM3AzdHpteWJrMHNnamdhejloaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ld0KuyVjTQnQO7EMc2/giphy.gif'
    },
    {
        id: 5,
        name: 'Sunset Drive',
        url: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTZ5ZnFzcGl1Y2g4N2t4ajAxdGRuamlydHBnZzYwcG9xYm5xYjljZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tkaDAjbZUmoH1a1Z2R/giphy.gif'
    },
    {
        id: 6,
        name: 'Clove',
        url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWRnOG54ZnFibTlwdnJ6NXRsNjVrZzBxdWl3ZWZiNXVyY2prbGg2NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Am8zitLeNJlxlXarDT/giphy.gif'
    },
    {
        id: 7,
        name: 'ChineseCat',
        url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzhwdHZheGhoeWlsNnNvdW0zNGtqZTJmOWJkeWp0N2NkNnFhYmp5ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3UkqVq3F50bVCi9URl/giphy.gif'
    },
];

function MusicPlayer({ autoPlay }) {
    const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
    const [currentBackdropIndex, setCurrentBackdropIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false); // Start false to wait for player
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Player ref
    const playerRef = useRef(null);

    const currentStream = MUSIC_STREAMS[currentStreamIndex];
    const currentBackdrop = BACKDROP_GIFS[currentBackdropIndex];

    // Initialize player
    const onPlayerReady = (event) => {
        playerRef.current = event.target;
        event.target.setVolume(volume);
        if (isMuted) {
            event.target.mute();
        } else {
            event.target.unMute();
        }
        event.target.playVideo();
        setIsPlaying(true);
    };

    const onPlayerStateChange = (event) => {
        // 1 = playing, 2 = paused
        if (event.data === 1) {
            setIsPlaying(true);
        } else if (event.data === 2) {
            setIsPlaying(false);
        }
    };

    // Effect to handle volume changes
    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.setVolume(volume);
        }
    }, [volume]);

    // Effect to handle mute changes
    useEffect(() => {
        if (playerRef.current) {
            if (isMuted) {
                playerRef.current.mute();
            } else {
                playerRef.current.unMute();
            }
        }
    }, [isMuted]);

    // Effect to handle play/pause changes
    useEffect(() => {
        if (playerRef.current) {
            if (isPlaying || (autoPlay && playerRef.current.getPlayerState() !== 1)) {
                // Check current state to avoid loops if needed, 
                // but playVideo/pauseVideo are generally safe to call safely
                try {
                    const state = playerRef.current.getPlayerState();
                    if ((isPlaying || autoPlay) && state !== 1 && state !== 3) {
                        playerRef.current.playVideo();
                    } else if (!isPlaying && !autoPlay && state === 1) {
                        playerRef.current.pauseVideo();
                    }
                } catch (e) {
                    // ignore
                }
            } else {
                playerRef.current.pauseVideo();
            }
        }
    }, [isPlaying, autoPlay]);

    // Click on backdrop to cycle through GIFs
    const handleBackdropClick = useCallback(() => {
        setCurrentBackdropIndex((prev) => (prev + 1) % BACKDROP_GIFS.length);
    }, []);

    // Shuffle to random stream
    const handleShuffle = useCallback(() => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * MUSIC_STREAMS.length);
        } while (newIndex === currentStreamIndex && MUSIC_STREAMS.length > 1);
        setCurrentStreamIndex(newIndex);
        // Resetting the stream causes component re-render. 
        // react-youtube handles videoId prop change automatically.
        setIsPlaying(true);
    }, [currentStreamIndex]);

    // Toggle mute
    const toggleMute = useCallback(() => {
        setIsMuted(!isMuted);
    }, [isMuted]);

    // Toggle play/pause
    const togglePlay = useCallback(() => {
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    // Handle stream change from settings
    const handleStreamChange = useCallback((index) => {
        setCurrentStreamIndex(index);
        setIsPlaying(true);
    }, []);

    // Keyboard shortcuts for MusicPlayer
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            const key = e.key.toLowerCase();
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent page scroll
                togglePlay();
            } else if (key === 'm') {
                toggleMute();
            } else if (key === 'g') {
                handleBackdropClick();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [togglePlay, toggleMute, handleBackdropClick]); // Dependencies for methods/state used in listener



    // YouTube Options
    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
        },
    };

    return (
        <div className="music-player-fullscreen" role="region" aria-label="Music player — background and controls">
            {/* Clickable Backdrop GIF */}
            <div
                className="fullscreen-backdrop"
                style={{ backgroundImage: `url(${currentBackdrop.url})` }}
                onClick={handleBackdropClick}
            >
                <div className="backdrop-gradient"></div>
            </div>

            {/* YouTube Player (hidden but functional) */}
            <div className="youtube-container" style={{ position: 'absolute', top: -9999, left: -9999, visibility: 'hidden' }}>
                <YouTube
                    videoId={currentStream.videoId}
                    opts={opts}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}
                />
            </div>

            {/* Settings Toggle (top area) */}
            <button
                className="settings-toggle"
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Toggle settings"
            >
                ⚙️
            </button>

            {/* Settings Panel */}
            {showSettings && (
                <div className="settings-panel glass-card">
                    <div className="settings-section">
                        <h3>🎵 Music Stream</h3>
                        <div className="stream-options">
                            {MUSIC_STREAMS.map((stream, index) => (
                                <button
                                    key={stream.id}
                                    className={`stream-btn ${currentStreamIndex === index ? 'active' : ''}`}
                                    onClick={() => handleStreamChange(index)}
                                >
                                    {stream.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3>🖼️ Backdrop</h3>
                        <div className="backdrop-options">
                            {BACKDROP_GIFS.map((backdrop, index) => (
                                <button
                                    key={backdrop.id}
                                    className={`backdrop-btn ${currentBackdropIndex === index ? 'active' : ''}`}
                                    onClick={() => setCurrentBackdropIndex(index)}
                                    style={{ backgroundImage: `url(${backdrop.url})` }}
                                    title={backdrop.name}
                                >
                                    {currentBackdropIndex === index && <span className="check">✓</span>}
                                </button>
                            ))}
                        </div>
                        <p className="backdrop-hint">💡 Click anywhere on the background to cycle through backdrops</p>
                    </div>
                </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="bottom-controls">
                {/* Player Controls */}
                {/* Bottom Left Controls */}
                <div className="lofi-controls-container">
                    <button className="control-btn play-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"} style={{ color: '#ffffff' }}>
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24" style={{ display: 'block' }}>
                                <rect x="5" y="4" width="4" height="16" fill="#ffffff" />
                                <rect x="15" y="4" width="4" height="16" fill="#ffffff" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" style={{ display: 'block' }}>
                                <path d="M7 4v16l12-8z" fill="#ffffff" />
                            </svg>
                        )}
                    </button>

                    <div className="volume-control-group">
                        <button className="control-btn volume-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'} style={{ color: '#ffffff' }}>
                            {isMuted ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                                    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="#ffffff" />
                                    <line x1="23" y1="9" x2="17" y2="15" stroke="#ffffff" />
                                    <line x1="17" y1="9" x2="23" y2="15" stroke="#ffffff" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                                    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="#ffffff" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#ffffff" />
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="#ffffff" />
                                </svg>
                            )}
                        </button>
                        <input
                            type="range"
                            className="volume-slider"
                            min="0"
                            max="100"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                                setVolume(Number(e.target.value));
                                if (isMuted && Number(e.target.value) > 0) setIsMuted(false);
                            }}
                        />
                    </div>

                    <button className="control-btn shuffle-btn" onClick={handleShuffle} title="Shuffle Backdrop" style={{ color: '#ffffff' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                            <path d="M16 3h5v5" stroke="#ffffff" />
                            <path d="M4 20L21 3" stroke="#ffffff" />
                            <path d="M21 16v5h-5" stroke="#ffffff" />
                            <path d="M15 15l6 6" stroke="#ffffff" />
                            <path d="M4 4l5 5" stroke="#ffffff" />
                        </svg>
                    </button>
                </div>

                {/* Bottom Right Ticker */}
                <div className="lofi-ticker-container glass-card">
                    <div className="ticker-content">
                        <span className="ticker-text">
                            • {MUSIC_STREAMS[currentStreamIndex].name} - {MUSIC_STREAMS[currentStreamIndex].description} 🧘 • Stay Chill • {MUSIC_STREAMS[currentStreamIndex].name} - {MUSIC_STREAMS[currentStreamIndex].description} 🧘
                        </span>
                        <span className="ticker-text">
                            • {MUSIC_STREAMS[currentStreamIndex].name} - {MUSIC_STREAMS[currentStreamIndex].description} 🧘 • Stay Chill • {MUSIC_STREAMS[currentStreamIndex].name} - {MUSIC_STREAMS[currentStreamIndex].description} 🧘
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;
