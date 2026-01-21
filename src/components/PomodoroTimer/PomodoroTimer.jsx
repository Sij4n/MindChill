import React, { useState, useEffect, useRef, useCallback } from 'react';
import './PomodoroTimer.css';

const TIMER_MODES = {
    WORK: { name: 'Focus', duration: 25 * 60, color: '#8b5cf6' },
    SHORT_BREAK: { name: 'Short Break', duration: 5 * 60, color: '#10b981' },
    LONG_BREAK: { name: 'Long Break', duration: 15 * 60, color: '#3b82f6' }
};

function PomodoroTimer() {
    const [mode, setMode] = useState('WORK');
    const [timeLeft, setTimeLeft] = useState(TIMER_MODES.WORK.duration);
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);
    const intervalRef = useRef(null);

    const currentMode = TIMER_MODES[mode];
    const progress = ((currentMode.duration - timeLeft) / currentMode.duration) * 100;

    const playNotification = useCallback(() => {
        // Create a simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }, []);

    const switchMode = useCallback((newMode) => {
        setMode(newMode);
        setTimeLeft(TIMER_MODES[newMode].duration);
        setIsRunning(false);
    }, []);

    const handleTimerComplete = useCallback(() => {
        playNotification();

        if (mode === 'WORK') {
            const newSessions = sessions + 1;
            setSessions(newSessions);

            // After 4 work sessions, take a long break
            if (newSessions % 4 === 0) {
                switchMode('LONG_BREAK');
            } else {
                switchMode('SHORT_BREAK');
            }
        } else {
            switchMode('WORK');
        }
    }, [mode, sessions, playNotification, switchMode]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeLeft, handleTimerComplete]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(currentMode.duration);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // SVG circle calculations
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="pomodoro-timer glass-card">
            <div className="timer-header">
                <h2>⏱️ Pomodoro Timer</h2>
                <div className="session-count">
                    <span className="session-icon">🎯</span>
                    <span>{sessions} sessions</span>
                </div>
            </div>

            {/* Mode Tabs */}
            <div className="mode-tabs">
                {Object.entries(TIMER_MODES).map(([key, value]) => (
                    <button
                        key={key}
                        className={`mode-tab ${mode === key ? 'active' : ''}`}
                        onClick={() => switchMode(key)}
                    >
                        {value.name}
                    </button>
                ))}
            </div>

            {/* Timer Display */}
            <div className="timer-display">
                <svg className="progress-ring" width="220" height="220">
                    {/* Background circle */}
                    <circle
                        className="progress-ring-bg"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="transparent"
                        r={radius}
                        cx="110"
                        cy="110"
                    />
                    {/* Progress circle */}
                    <circle
                        className="progress-ring-progress"
                        stroke={currentMode.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="transparent"
                        r={radius}
                        cx="110"
                        cy="110"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                            transition: 'stroke-dashoffset 0.5s ease'
                        }}
                    />
                </svg>
                <div className="timer-text">
                    <span className="time">{formatTime(timeLeft)}</span>
                    <span className="mode-label" style={{ color: currentMode.color }}>
                        {currentMode.name}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="timer-controls">
                <button
                    className={`control-btn primary ${isRunning ? 'pause' : 'play'}`}
                    onClick={toggleTimer}
                >
                    {isRunning ? '⏸️ Pause' : '▶️ Start'}
                </button>
                <button
                    className="control-btn secondary"
                    onClick={resetTimer}
                >
                    🔄 Reset
                </button>
            </div>

            {/* Progress indicators */}
            <div className="progress-dots">
                {[1, 2, 3, 4].map((dot) => (
                    <span
                        key={dot}
                        className={`dot ${sessions % 4 >= dot ? 'completed' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default PomodoroTimer;
