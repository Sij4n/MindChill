import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PromoVideo.css';

// Real components
import PomodoroTimer from '../PomodoroTimer/PomodoroTimer';
import TodoList from '../TodoList/TodoList';
import MusicPlayer from '../MusicPlayer/MusicPlayer';

/* ── Scene config (total ≈ 40s) ────────────────────────────── */
const SCENES = [
    { id: 1, start: 0, end: 5, label: null },                                               // Intro
    { id: 2, start: 5, end: 15, label: '🎧 Curated Lo-Fi Streams', sub: 'Switch stations · Set the mood · Get in the zone' },
    { id: 3, start: 15, end: 23, label: '⏱️ Pomodoro Timer', sub: 'Structured focus sessions with work / break intervals' },
    { id: 4, start: 23, end: 31, label: '📝 Todo List', sub: 'Track tasks locally · Stay on top of your day' },
    { id: 5, start: 31, end: 37, label: '📹 Study With Me', sub: 'Peer-to-peer video sessions · Study together, anywhere' },
    { id: 6, start: 37, end: 42, label: null },                                               // Outro
];
const TOTAL = SCENES[SCENES.length - 1].end; // 42 s

/* ── helpers ─────────────────────────────────────────────────── */
const getScene = (t) => SCENES.find(s => t >= s.start && t < s.end) || SCENES[SCENES.length - 1];

/* ── animations ──────────────────────────────────────────────── */
const fadeSlide = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [.22, 1, .36, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
};

const scalePop = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 180, damping: 12 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.3 } },
};

const labelAnim = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.3 } },
    exit: { opacity: 0, x: 30, transition: { duration: 0.3 } },
};

/* ── Particles (memoised so they don't re-shuffle) ───────────── */
const Particles = React.memo(() => {
    const dots = useMemo(() =>
        Array.from({ length: 25 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 5 + 2,
            dur: Math.random() * 8 + 6,
            delay: Math.random() * 4,
        })), []);

    return (
        <div className="particles-layer">
            {dots.map(d => (
                <motion.span
                    key={d.id}
                    className="dot"
                    style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size }}
                    animate={{ y: [0, -60, 0], opacity: [0.15, 0.5, 0.15] }}
                    transition={{ duration: d.dur, repeat: Infinity, delay: d.delay, ease: 'linear' }}
                />
            ))}
        </div>
    );
});

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const PromoVideo = ({ onComplete }) => {
    const [elapsed, setElapsed] = useState(0);

    /* master clock */
    useEffect(() => {
        const t0 = Date.now();
        const id = setInterval(() => {
            const e = (Date.now() - t0) / 1000;
            if (e >= TOTAL) { setElapsed(TOTAL); clearInterval(id); onComplete?.(); }
            else setElapsed(e);
        }, 60);
        return () => clearInterval(id);
    }, [onComplete]);

    const scene = getScene(elapsed);
    const progress = (elapsed / TOTAL) * 100;
    const isLive = scene.id === 2;          // backdrop visible in scene 2

    return (
        <div className={`showcase ${isLive ? 'live-bg' : ''}`}>

            {/* ── ambient background ───────────────────────────────── */}
            <div className="ambient">
                <div className="glow glow-1" />
                <div className="glow glow-2" />
                {!isLive && <Particles />}
            </div>

            {/* ── scene content ────────────────────────────────────── */}
            <AnimatePresence mode="wait">

                {/* SCENE 1 — Intro */}
                {scene.id === 1 && (
                    <motion.div key="s1" className="center-col" {...scalePop}>
                        <h1 className="brand">MIND CHILL</h1>
                        <motion.p className="tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                            Your cozy space to focus.
                        </motion.p>
                        {/* expanding rings */}
                        <motion.span className="ring r1" animate={{ scale: [1, 2.5], opacity: [0.5, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
                        <motion.span className="ring r2" animate={{ scale: [1, 2.5], opacity: [0.4, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }} />
                    </motion.div>
                )}

                {/* SCENE 2 — Lo-Fi Streams (REAL) */}
                {scene.id === 2 && (
                    <motion.div key="s2" className="full-scene" {...fadeSlide}>
                        {/* Real music player fills the background */}
                        <div className="live-player-wrap">
                            <MusicPlayer autoPlay={true} showSettingsInitially={true} />
                        </div>
                        {/* overlay label */}
                        <motion.div className="scene-label glass-label" {...labelAnim}>
                            <span className="label-icon">🎧</span>
                            <div>
                                <h2>Curated Lo-Fi Streams</h2>
                                <p>Switch stations · Set the mood · Get in the zone</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* SCENE 3 — Pomodoro Timer (REAL) */}
                {scene.id === 3 && (
                    <motion.div key="s3" className="split-scene" {...fadeSlide}>
                        <div className="feature-card glass-card-promo">
                            <PomodoroTimer />
                        </div>
                        <motion.div className="scene-label side-label" {...labelAnim}>
                            <h2>⏱️ Pomodoro Timer</h2>
                            <p>Structured focus sessions with work / break intervals</p>
                        </motion.div>
                    </motion.div>
                )}

                {/* SCENE 4 — Todo List (REAL) */}
                {scene.id === 4 && (
                    <motion.div key="s4" className="split-scene reverse" {...fadeSlide}>
                        <motion.div className="scene-label side-label" {...labelAnim}>
                            <h2>📝 Todo List</h2>
                            <p>Track tasks locally · Stay on top of your day</p>
                        </motion.div>
                        <div className="feature-card glass-card-promo">
                            <TodoList />
                        </div>
                    </motion.div>
                )}

                {/* SCENE 5 — Study With Me (mock UI) */}
                {scene.id === 5 && (
                    <motion.div key="s5" className="center-col" {...fadeSlide}>
                        <div className="video-mock">
                            <div className="cam cam-left glass-card-promo">
                                <div className="cam-placeholder">
                                    <span>👤</span>
                                    <small>You</small>
                                </div>
                            </div>
                            <motion.div className="conn-line"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                            />
                            <div className="cam cam-right glass-card-promo">
                                <div className="cam-placeholder">
                                    <span>👥</span>
                                    <small>Peer</small>
                                </div>
                            </div>
                        </div>
                        <motion.div className="scene-label" {...labelAnim}>
                            <h2>📹 Study With Me</h2>
                            <p>Peer-to-peer video sessions · Study together, anywhere</p>
                        </motion.div>
                    </motion.div>
                )}

                {/* SCENE 6 — Outro */}
                {scene.id === 6 && (
                    <motion.div key="s6" className="center-col" {...scalePop}>
                        <motion.h1 className="brand pulse"
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 1.6, repeat: Infinity }}
                        >
                            MIND CHILL
                        </motion.h1>
                        <motion.p className="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                            Let's LOCK IN 🌿
                        </motion.p>
                        <motion.a className="link neon-glow" href="https://mindchill.netlify.app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                            mindchill.netlify.app
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── progress bar ─────────────────────────────────────── */}
            <div className="progress" style={{ width: `${progress}%` }} />
        </div>
    );
};

export default PromoVideo;
