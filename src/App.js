import React, { useState } from 'react';
import './App.css';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer';
import TodoList from './components/TodoList/TodoList';
import VideoCall from './components/VideoCall/VideoCall';

function App() {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="app">
      {/* Fullscreen Music Player with Backdrop */}
      <MusicPlayer />

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
              <h2 className="about-title">About Mind Chill</h2>
              <div className="about-section">
                <h3>The Project</h3>
                <p>
                  Mind Chill is a curated workspace designed to enhance focus, relaxation, and productivity.
                  Combining aesthetic pixel art visuals with lo-fi beats, it provides a cozy
                  virtual environment for study, work, or meditation.
                </p>
              </div>
              <div className="about-section">
                <h3>Features</h3>
                <ul>
                  <li>🎵 Curated Lofi Streams & Interactive Backdrops</li>
                  <li>⏱️ Built-in Pomodoro Timer for deep focus</li>
                  <li>✅ Integrated To-Do List to track progress</li>
                  <li>📹 "Study With Me" Peer-to-Peer Video Calling</li>
                </ul>
              </div>
              <div className="about-section">
                <h3>The Creator</h3>
                <p>
                  Developed with ❤️ by <strong>Sijan Pradhan</strong>.
                  My goal was to create a minimal yet powerful hub that helps people
                  stay productive while enjoying a peaceful atmosphere.
                </p>
              </div>
              <div className="about-footer">
                <p>© 2026 Mind Chill • Stay Cozy</p>
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
