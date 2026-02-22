/**
 * Mind Chill - Main Application Component
 *
 * @author Sijan Pradhan
 * @description Orchestrates the main layout, state management for popups, and core feature integration.
 * @version 1.0.0
 */

import React, { useState } from 'react';
import './App.css';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer';
import TodoList from './components/TodoList/TodoList';
import VideoCall from './components/VideoCall/VideoCall';
import { useEffect } from 'react';

function App() {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;

    const handleStart = () => {
      splash.classList.add('fade-out');
      setHasStarted(true);
      setTimeout(() => {
        splash.remove();
      }, 800);
    };

    splash.addEventListener('click', handleStart);

    const handleGlobalKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'c' || key === 'p') {
        setIsPomodoroOpen(prev => !prev);
      } else if (key === 't') {
        setIsTodoOpen(prev => !prev);
      } else if (key === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      splash.removeEventListener('click', handleStart);
      window.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="app">
      {/* Fullscreen Music Player with Backdrop */}
      <MusicPlayer autoPlay={hasStarted} />

      {/* Header Overlay */}
      <header className="header-overlay">
        {/* Logo - Top Left */}
        <div className="logo">
          <span className="logo-text">Mind Chill</span>
        </div>

        {/* Icon Buttons - Top Right */}
        <div className="icon-panel">
          <button
            className="icon-btn"
            onClick={() => setIsPomodoroOpen(!isPomodoroOpen)}
            title="Pomodoro Timer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </button>
          <button
            className="icon-btn"
            onClick={() => setIsTodoOpen(!isTodoOpen)}
            title="Todo List"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </button>
          <button
            className="icon-btn"
            onClick={() => setIsAboutOpen(true)}
            title="About Project"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
          <button
            className="icon-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            )}
          </button>
          <button
            className="icon-btn"
            onClick={() => setIsVideoCallOpen(true)}
            title="Study With Me"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="14" height="14" rx="2" />
              <path d="M16 10l6-4v12l-6-4v-4z" />
            </svg>
          </button>
          <a
            href="https://github.com/Sij4n?tab=overview&from=2025-10-01&to=2025-10-31"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </div>
      </header>

      {/* Pomodoro Timer Popup */}
      {isPomodoroOpen && (
        <div className="popup-overlay" onClick={() => setIsPomodoroOpen(false)}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setIsPomodoroOpen(false)}>✕</button>
            <PomodoroTimer />
          </div>
        </div>
      )}

      {/* Todo List Popup */}
      {isTodoOpen && (
        <div className="popup-overlay" onClick={() => setIsTodoOpen(false)}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setIsTodoOpen(false)}>✕</button>
            <TodoList />
          </div>
        </div>
      )}

      {/* About Popup */}
      {isAboutOpen && (
        <div className="popup-overlay" onClick={() => setIsAboutOpen(false)}>
          <div className="popup-container about-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setIsAboutOpen(false)}>✕</button>
            <div className="about-content glass-card">
              <h2 className="about-title">Mind Chill</h2>
              <p className="about-subtitle">Your aesthetic lofi workspace for deep focus.</p>

              <div className="shortcuts-section">
                <h3>⌨️ Shortcuts</h3>
                <div className="shortcuts-grid">
                  <div className="shortcut-item"><kbd>Space</kbd> <span>Play/Pause</span></div>
                  <div className="shortcut-item"><kbd>G</kbd> <span>Backdrop</span></div>
                  <div className="shortcut-item"><kbd>M</kbd> <span>Mute</span></div>
                  <div className="shortcut-item"><kbd>C</kbd> / <kbd>P</kbd> <span>Timer</span></div>
                  <div className="shortcut-item"><kbd>T</kbd> <span>Todo</span></div>
                  <div className="shortcut-item"><kbd>F</kbd> <span>Fullscreen</span></div>
                </div>
              </div>

              <div className="about-footer">
                <p>Made with  by Sijan Pradhan</p>
                <p>© 2026 • Stay Cozy</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      <VideoCall
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
      />
    </div>
  );
}

export default App;
