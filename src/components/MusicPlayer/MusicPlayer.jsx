import React, { useState, useEffect, useRef } from 'react';
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
    }
];

function MusicPlayer() {
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
            if (isPlaying) {
                // Check current state to avoid loops if needed, 
                // but playVideo/pauseVideo are generally safe to call safely
                try {
                    const state = playerRef.current.getPlayerState();
                    if (isPlaying && state !== 1 && state !== 3) {
                        playerRef.current.playVideo();
                    } else if (!isPlaying && state === 1) {
                        playerRef.current.pauseVideo();
                    }
                } catch (e) {
                    // ignore
                }
            } else {
                playerRef.current.pauseVideo();
            }
        }
    }, [isPlaying]);


    // Click on backdrop to cycle through GIFs
    const handleBackdropClick = () => {
        setCurrentBackdropIndex((prev) => (prev + 1) % BACKDROP_GIFS.length);
    };

    // Shuffle to random stream
    const handleShuffle = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * MUSIC_STREAMS.length);
        } while (newIndex === currentStreamIndex && MUSIC_STREAMS.length > 1);
        setCurrentStreamIndex(newIndex);
        // Resetting the stream causes component re-render. 
        // react-youtube handles videoId prop change automatically.
        setIsPlaying(true);
    };

    // Toggle mute
    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    // Toggle play/pause
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Handle stream change from settings
    const handleStreamChange = (index) => {
        setCurrentStreamIndex(index);
        setIsPlaying(true);
    };

    // Generate ticker text
    const tickerText = MUSIC_STREAMS.map(s => `${s.name} - ${s.description} 📡`).join('  •  ');

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
        <div className="music-player-fullscreen">
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
                <div className="player-controls">
                    {/* Play/Pause */}
                    <button className="control-btn play-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                        {isPlaying ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>

                    {/* Volume */}
                    <div className="volume-control">
                        <button className="control-btn volume-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
                            {isMuted ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
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


                    {/* Shuffle */}
                    <button className="control-btn shuffle-btn" onClick={handleShuffle} title="Shuffle stream">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 3 21 3 21 8"></polyline>
                            <line x1="4" y1="20" x2="21" y2="3"></line>
                            <polyline points="21 16 21 21 16 21"></polyline>
                            <line x1="15" y1="15" x2="21" y2="21"></line>
                            <line x1="4" y1="4" x2="9" y2="9"></line>
                        </svg>
                    </button>
                </div>

                {/* Scrolling Ticker */}
                <div className="music-ticker">
                    <div className="ticker-content">
                        <span className="ticker-text">
                            {tickerText}  •  {tickerText}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;
