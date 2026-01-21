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

            // Get local media stream
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            // Generate a short room ID
            const roomId = uuidv4().slice(0, 8).toUpperCase();

            // Create peer with the room ID
            const peer = new Peer(roomId);

            peer.on('open', (id) => {
                setPeerId(id);
                setConnectionStatus('ready');
            });

            peer.on('call', (call) => {
                setConnectionStatus('incoming');
                // Auto-answer incoming calls
                call.answer(localStreamRef.current);

                call.on('stream', (remoteStream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                    setIsConnected(true);
                    setConnectionStatus('connected');
                });

                call.on('close', () => {
                    setIsConnected(false);
                    setConnectionStatus('ready');
                });

                callRef.current = call;
            });

            peer.on('error', (err) => {
                console.error('Peer error:', err);
                setConnectionStatus('error');
            });

            peerRef.current = peer;
        } catch (err) {
            console.error('Failed to initialize:', err);
            setConnectionStatus('error');
        }
    }, []);

    // Call a remote peer
    const callPeer = useCallback(() => {
        if (!remotePeerId.trim() || !peerRef.current || !localStreamRef.current) return;

        setConnectionStatus('calling');

        const call = peerRef.current.call(remotePeerId.trim().toUpperCase(), localStreamRef.current);

        call.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
            setIsConnected(true);
            setConnectionStatus('connected');
        });

        call.on('close', () => {
            setIsConnected(false);
            setConnectionStatus('ready');
        });

        call.on('error', (err) => {
            console.error('Call error:', err);
            setConnectionStatus('error');
        });

        callRef.current = call;
    }, [remotePeerId]);

    // Toggle audio
    const toggleAudio = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioMuted(!audioTrack.enabled);
            }
        }
    }, []);

    // Toggle video
    const toggleVideo = useCallback(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    }, []);

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
        }
        if (peerRef.current) {
            peerRef.current.destroy();
        }
        setPeerId('');
        setRemotePeerId('');
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
                <div className="modal-header">
                    <h2>📹 Study With Me</h2>
                    <button className="close-btn" onClick={handleClose}>✕</button>
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

                {/* Video Container */}
                <div className={`video-container ${isConnected ? 'connected' : ''}`}>
                    {/* Remote Video (Large) */}
                    <div className="remote-video-wrapper">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="remote-video"
                        />
                        {!isConnected && (
                            <div className="video-placeholder">
                                <span className="placeholder-icon">👋</span>
                                <span>Waiting for friend...</span>
                            </div>
                        )}
                    </div>

                    {/* Local Video (Small PIP) */}
                    <div className={`local-video-wrapper ${isVideoOff ? 'video-off' : ''}`}>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="local-video"
                        />
                        {isVideoOff && (
                            <div className="video-off-indicator">
                                <span>📷</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Room Connection */}
                {!isConnected && (
                    <div className="connection-panel">
                        {/* Your Room ID */}
                        <div className="room-id-section">
                            <label>Your Room ID</label>
                            <div className="room-id-display">
                                <span className="room-id">{peerId || '...'}</span>
                                <button
                                    className="copy-btn"
                                    onClick={copyRoomId}
                                    disabled={!peerId}
                                >
                                    {copied ? '✓ Copied!' : '📋 Copy'}
                                </button>
                            </div>
                            <p className="room-hint">Share this ID with your friend</p>
                        </div>

                        {/* Join Room */}
                        <div className="join-section">
                            <label>Join a Friend</label>
                            <div className="join-input-group">
                                <input
                                    type="text"
                                    placeholder="Enter friend's Room ID"
                                    value={remotePeerId}
                                    onChange={(e) => setRemotePeerId(e.target.value.toUpperCase())}
                                    className="room-input"
                                    maxLength={8}
                                />
                                <button
                                    className="join-btn"
                                    onClick={callPeer}
                                    disabled={!remotePeerId.trim() || connectionStatus !== 'ready'}
                                >
                                    📞 Call
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="video-controls">
                    <button
                        className={`control-btn ${isAudioMuted ? 'off' : ''}`}
                        onClick={toggleAudio}
                        title={isAudioMuted ? 'Unmute' : 'Mute'}
                    >
                        {isAudioMuted ? '🔇' : '🎤'}
                    </button>
                    <button
                        className={`control-btn ${isVideoOff ? 'off' : ''}`}
                        onClick={toggleVideo}
                        title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                    >
                        {isVideoOff ? '📷' : '📹'}
                    </button>
                    {isConnected && (
                        <button
                            className="control-btn end-call"
                            onClick={endCall}
                            title="End call"
                        >
                            📞
                        </button>
                    )}
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
