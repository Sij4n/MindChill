import React, { useState, useRef, useEffect, useCallback } from 'react';
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import './VideoCall.css';

function VideoCall({ isOpen, onClose }) {
    const [peerId, setPeerId] = useState('');
    const [remotePeerId, setRemotePeerId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('idle');
    const [localStream, setLocalStream] = useState(null);
    const [mediaError, setMediaError] = useState(null);
    const [copied, setCopied] = useState(false);

    const peerRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const callRef = useRef(null);

    // Initialize peer connection
    const initializePeer = useCallback(async () => {
        try {
            setConnectionStatus('initializing');

            // 1. First, create the Peer connection (don't wait for camera yet)
            const roomId = uuidv4().slice(0, 8).toUpperCase();
            console.log('Creating peer with ID:', roomId);
            const peer = new Peer(roomId, {
                debug: 2 // Log errors and warnings
            });

            peer.on('open', (id) => {
                console.log('Peer connection opened with ID:', id);
                setPeerId(id);
                setConnectionStatus('ready');
            });

            peer.on('call', (call) => {
                console.log('Incoming call received');
                setConnectionStatus('incoming');

                // If we don't have a stream yet, we'll try to get it now
                if (!localStream) {
                    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                        .then(stream => {
                            setLocalStream(stream);
                            call.answer(stream);
                            handleCallStream(call);
                        })
                        .catch(err => {
                            console.error('Failed to get media for incoming call:', err);
                            setConnectionStatus('error');
                        });
                } else {
                    call.answer(localStream);
                    handleCallStream(call);
                }
            });

            peer.on('error', (err) => {
                console.error('Peer error type:', err.type);
                console.error('Peer error details:', err);
                setConnectionStatus('error');

                // If ID is taken, try again with no ID (auto-generated)
                if (err.type === 'unavailable-id') {
                    console.log('ID taken, retrying with auto-generated ID...');
                    const fallbackPeer = new Peer();
                    fallbackPeer.on('open', (id) => {
                        setPeerId(id);
                        setConnectionStatus('ready');
                    });
                    peerRef.current = fallbackPeer;
                }
            });

            peerRef.current = peer;

            // 2. Parallel: Try to get local media stream
            requestMediaPermissions();

        } catch (err) {
            console.error('Failed to initialize VideoCall component:', err);
            setConnectionStatus('error');
        }
    }, []);

    // Helper to request media permissions
    const requestMediaPermissions = useCallback(async () => {
        try {
            console.log('Requesting camera/mic permissions...');
            setConnectionStatus('initializing');

            // Try to get both first
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            console.log('Media stream obtained successfully');
            localStreamRef.current = stream;
            setLocalStream(stream);
            setMediaError(null);
            setConnectionStatus('ready');
        } catch (mediaErr) {
            console.error('Media permission denied or failed:', mediaErr);

            let errorMessage = 'Media Error';
            if (mediaErr.name === 'NotAllowedError' || mediaErr.name === 'PermissionDeniedError') {
                errorMessage = 'Blocked: Check address bar icon 🛡️';
            } else if (mediaErr.name === 'NotFoundError' || mediaErr.name === 'DevicesNotFoundError') {
                errorMessage = 'No Camera/Mic Found';
            } else if (mediaErr.name === 'NotReadableError' || mediaErr.name === 'TrackStartError') {
                errorMessage = 'Camera busy: Close other apps';
            } else {
                errorMessage = 'Unable to start camera';
            }

            setMediaError(errorMessage);
            setConnectionStatus('error');
        }
    }, []);

    // Sync video elements with streams
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Helper for handling call streams
    const handleCallStream = (call) => {
        call.on('stream', (remoteStream) => {
            console.log('Remote stream received');
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
            setIsConnected(true);
            setConnectionStatus('connected');
        });

        call.on('close', () => {
            console.log('Call closed');
            setIsConnected(false);
            setConnectionStatus('ready');
        });

        callRef.current = call;
    };

    // Call a remote peer
    const callPeer = useCallback(async () => {
        if (!remotePeerId.trim() || !peerRef.current) return;

        // Ensure we have a local stream before calling
        if (!localStream) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                const call = peerRef.current.call(remotePeerId.trim().toUpperCase(), stream);
                handleCallStream(call);
            } catch (err) {
                console.error('Cannot call without media permissions:', err);
                alert('Please allow camera/microphone access to make calls.');
                return;
            }
        } else {
            setConnectionStatus('calling');
            console.log('Calling peer:', remotePeerId.trim().toUpperCase());

            const call = peerRef.current.call(remotePeerId.trim().toUpperCase(), localStream);
            handleCallStream(call);
        }
    }, [remotePeerId, localStream]);

    // Toggle audio
    const toggleAudio = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioMuted(!audioTrack.enabled);
            }
        }
    }, [localStream]);

    // Toggle video
    const toggleVideo = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    }, [localStream]);

    // End call
    const endCall = useCallback(() => {
        if (callRef.current) {
            callRef.current.close();
        }
        setIsConnected(false);
        setConnectionStatus('ready');
        setRemotePeerId('');
    }, []);

    // Copy room ID
    const copyRoomId = useCallback(() => {
        navigator.clipboard.writeText(peerId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [peerId]);

    // Cleanup on unmount or close
    const cleanup = useCallback(() => {
        if (callRef.current) {
            callRef.current.close();
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        if (peerRef.current) {
            peerRef.current.destroy();
        }
        setPeerId('');
        setRemotePeerId('');
        setLocalStream(null);
        setIsConnected(false);
        setConnectionStatus('idle');
    }, []);

    // Initialize when modal opens
    useEffect(() => {
        if (isOpen) {
            initializePeer();
        } else {
            cleanup();
        }

        return cleanup;
    }, [isOpen, initializePeer, cleanup]);

    // Handle close
    const handleClose = () => {
        cleanup();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="video-call-overlay" onClick={handleClose}>
            <div className="video-call-modal glass-card" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                {/* New Header Layout */}
                <div className="study-header">
                    <div className="study-title-group">
                        <h1 className="study-title">Study Together</h1>
                    </div>

                    <div className="study-actions-group">
                        <div className="room-setup-item">
                            <span className="room-label">Your Code:</span>
                            <span className={`room-code-value ${!peerId ? 'loading' : ''}`}>
                                {peerId || 'INITIALIZING...'}
                            </span>
                            {peerId && (
                                <button className="mini-action-btn" onClick={copyRoomId} title="Copy Code">
                                    {copied ? '✓' : '📋'}
                                </button>
                            )}
                        </div>

                        <div className="join-group-mini">
                            <input
                                type="text"
                                className="mini-join-input"
                                placeholder="Enter code to join"
                                value={remotePeerId}
                                onChange={(e) => setRemotePeerId(e.target.value.toUpperCase())}
                                maxLength={8}
                            />
                            <button
                                className="mini-join-submit"
                                onClick={callPeer}
                                disabled={!remotePeerId.trim() || isConnected}
                            >
                                →
                            </button>
                        </div>

                        <button className="study-close-btn" onClick={handleClose} title="Close">✕</button>
                    </div>
                </div>

                {/* Connection Status */}
                <div className={`connection-status ${connectionStatus}`}>
                    <span className="status-dot"></span>
                    <span className="status-text">
                        {connectionStatus === 'idle' && 'Initializing...'}
                        {connectionStatus === 'initializing' && 'Setting up camera...'}
                        {connectionStatus === 'ready' && 'Ready to connect'}
                        {connectionStatus === 'calling' && 'Calling...'}
                        {connectionStatus === 'incoming' && 'Incoming call...'}
                        {connectionStatus === 'connected' && 'Connected'}
                        {connectionStatus === 'error' && 'Connection error'}
                    </span>
                </div>

                {/* Dual Video Grid */}
                <div className="study-video-grid">
                    <div className="video-slot">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`study-video ${isVideoOff ? 'video-off' : ''}`}
                        />
                        <div className="video-label">You</div>
                        {isVideoOff && <div className="video-off-overlay">Camera Off</div>}
                        {mediaError && (
                            <div className="video-off-overlay error">
                                <span className="error-title">{mediaError}</span>
                                <p className="error-hint">
                                    {mediaError.includes('Blocked') && "Click the camera icon in your address bar to 'Allow' access."}
                                    {mediaError.includes('busy') && "Another application is using your camera."}
                                    {mediaError.includes('Found') && "Please connect a camera or check your system settings."}
                                </p>
                                <button className="retry-btn" onClick={requestMediaPermissions}>
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="video-slot">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className={`study-video ${!isConnected ? 'waiting' : ''}`}
                        />
                        <div className="video-label">Partner</div>
                        {!isConnected && (
                            <div className="video-off-overlay waiting-overlay">
                                <span>Waiting for partner...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Controls */}
                <div className="study-controls-floating">
                    <button
                        className={`study-control-btn ${isAudioMuted ? 'muted' : ''}`}
                        onClick={toggleAudio}
                        title={isAudioMuted ? 'Unmute' : 'Mute'}
                    >
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                            {isAudioMuted ? (
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            ) : (
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zM17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                            )}
                        </svg>
                    </button>

                    <button
                        className={`study-control-btn ${isVideoOff ? 'off' : ''}`}
                        onClick={toggleVideo}
                        title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                    >
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                    </button>

                    <button
                        className="study-control-btn study-end-call"
                        onClick={handleClose}
                        title="Leave Session"
                    >
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                            <path d="M18.3 5.71a.9959.9959 0 00-1.41 0L12 10.59 7.11 5.7a.9959.9959 0 00-1.41 0c-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                        </svg>
                    </button>
                </div>

                {/* Privacy Notice */}
                <p className="privacy-notice">
                    🔒 Peer-to-peer connection • No data stored on servers
                </p>
            </div>
        </div>
    );
}

export default VideoCall;
