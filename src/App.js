import React, { useCallback, useEffect, useState } from 'react';
import { Leaf, Timer, ListTodo, Users, Maximize, Minimize, SlidersHorizontal, Info, Sparkles, NotebookPen } from 'lucide-react';
import './App.css';
import Dialog from './components/Dialog';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer';
import TodoList from './components/TodoList/TodoList';
import Scratchpad from './components/Scratchpad';
import VideoCall from './components/VideoCall/VideoCall';
import PromoVideo from './components/PromoVideo/PromoVideo';
import useStoredState from './useStoredState';
import useFocusTimer, { formatTime, localDay, MODES } from './useFocusTimer';

function App() {
  const [panel, setPanel] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [name, setName] = useStoredState('mindchill-name', '', v => typeof v === 'string' && v.length <= 30);
  const [intention, setIntention] = useStoredState('mindchill-intention', '', v => typeof v === 'string' && v.length <= 160);
  const [goal, setGoal] = useStoredState('mindchill-daily-goal', 60, v => Number.isInteger(v) && v >= 15 && v <= 480);
  const [theme, setTheme] = useStoredState('mindchill-theme', 'sage', v => ['sage', 'rose', 'lavender'].includes(v));
  const timer = useFocusTimer();
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const closePanel = useCallback(() => setPanel(null), []);
  const focusOnTask = useCallback(text => { setIntention(text.slice(0, 160)); setPanel('timer'); }, [setIntention]);
  const isPromoMode = new URLSearchParams(window.location.search).get('promo') === 'true';
  const toggleFullscreen = useCallback(async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen?.(); else await document.documentElement.requestFullscreen?.(); } catch { /* Browser may not support fullscreen. */ }
  }, []);
  useEffect(() => {
    const splash = document.getElementById('splash-screen');
    let timeout;
    const start = () => { setHasStarted(true); splash?.classList.add('fade-out'); timeout = setTimeout(() => splash?.remove(), 800); };
    const key = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); start(); } };
    if (isPromoMode) { splash?.remove(); setHasStarted(true); }
    splash?.addEventListener('click', start);
    splash?.addEventListener('keydown', key);
    return () => { clearTimeout(timeout); splash?.removeEventListener('click', start); splash?.removeEventListener('keydown', key); };
  }, [isPromoMode]);
  useEffect(() => {
    const handle = e => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="dialog"]')) return;
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
      if (['c', 'p', 't'].includes(e.key.toLowerCase())) setPanel(previous => previous === (e.key.toLowerCase() === 't' ? 'tasks' : 'timer') ? null : e.key.toLowerCase() === 't' ? 'tasks' : 'timer');
    };
    const changed = () => setIsFullscreen(!!document.fullscreenElement);
    window.addEventListener('keydown', handle); document.addEventListener('fullscreenchange', changed);
    return () => { window.removeEventListener('keydown', handle); document.removeEventListener('fullscreenchange', changed); };
  }, [toggleFullscreen]);
  const today = timer.history.filter(item => item.day === localDay());
  const minutes = today.reduce((sum, item) => sum + item.minutes, 0);
  const progress = Math.min(100, minutes / goal * 100);
  return <div className="app" data-theme={theme}>
    <MusicPlayer autoPlay={hasStarted} />
    <header className="header-overlay">
      <div className="workspace-brand"><span className="brand-mark"><Leaf size={22} /></span><div><span className="logo-text">mind chill<span className="brand-period">.</span></span><span className="brand-caption">A LITTLE ROOM FOR YOU</span></div></div>
      <nav className="icon-panel" aria-label="Workspace tools">
        <button className={`nav-tool ${panel === 'timer' ? 'selected' : ''}`} aria-label="Pomodoro Timer" onClick={() => setPanel('timer')}><Timer size={18} /><span>Focus</span></button>
        <button className="nav-tool" aria-label="Todo List" onClick={() => setPanel('tasks')}><ListTodo size={18} /><span>Tasks</span></button>
        <button className="nav-tool" aria-label="Study With Me" onClick={() => setPanel('study')}><Users size={18} /><span>Together</span></button>
        <button className="nav-tool" aria-label="Scratchpad" onClick={() => setPanel('notes')}><NotebookPen size={18} /><span>Notes</span></button>
        <span className="nav-divider" />
        <button className="icon-btn" aria-label="Personalize workspace" title="Make it yours" onClick={() => setPanel('personalize')}><SlidersHorizontal size={18} /></button>
        <button className="icon-btn fullscreen-tool" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} title="Fullscreen">{isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}</button>
      </nav>
    </header>
    {timer.isRunning && <button className="running-session glass-card" onClick={() => setPanel('timer')} aria-label="Open running focus timer"><span className="presence-dot" />{formatTime(timer.timeLeft)}<small>{MODES[timer.mode]}</small></button>}
    {timer.notice && <p className="session-notice glass-card" role="status">{timer.notice}</p>}
    <div className="workspace-utility"><button className="about-link" onClick={() => setPanel('about')} aria-label="About Project"><Info size={15} /><span>Slow down. Stay a while.</span></button></div>
    <Dialog open={panel === 'timer'} onClose={closePanel} label="Pomodoro Timer">
      <div className="focus-panel"><PomodoroTimer timer={timer} />
        <section className="focus-details">
          <label className="intention-label" htmlFor="session-intention"><Sparkles size={14} /> ONE THING FOR TODAY</label>
          <input id="session-intention" className="intention-input" placeholder="What would you like to make space for?" maxLength={160} value={intention} onChange={e => setIntention(e.target.value)} />
          <div className="daily-progress"><div className="daily-progress-copy"><span>{minutes >= goal ? 'A little promise, kept.' : 'Small steps, steady progress.'}</span><span>{minutes} / {goal} min today</span></div><div className="daily-track" role="progressbar" aria-label="Daily focus goal" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(minutes, goal)}><span style={{width:`${progress}%`}} /></div><small>{today.length} {today.length === 1 ? 'session' : 'sessions'} completed · at your own pace</small></div>
        </section>
      </div>
    </Dialog>
    <Dialog open={panel === 'tasks'} onClose={closePanel} label="Todo List"><TodoList onFocusTask={focusOnTask} /></Dialog>
    <Dialog open={panel === 'notes'} onClose={closePanel} label="Scratchpad"><Scratchpad /></Dialog>
    <Dialog open={panel === 'personalize'} onClose={closePanel} label="Personalize workspace">
      <section className="personalize-panel glass-card"><div className="panel-heading"><span className="eyebrow">A SPACE THAT FEELS LIKE YOU</span><h2>{name.trim() ? `${name.trim()}’s quiet corner.` : 'Make yourself at home.'}</h2><p>Little details. Your kind of calm.</p></div>
        <label className="field-label">What should we call you?<input maxLength={30} value={name} placeholder="Your name (optional)" onChange={e => setName(e.target.value)} /></label>
        <label className="field-label">Daily focus goal<select value={goal} onChange={e => setGoal(Number(e.target.value))}>{[15,30,60,90,120,180,240,480].map(value => <option key={value} value={value}>{value} minutes</option>)}</select><small>Completed focus sessions count toward your goal.</small></label>
        <fieldset className="theme-field"><legend>Your accent</legend><div className="theme-options">{['sage','rose','lavender'].map(value => <button key={value} className={`theme-option theme-${value}`} aria-pressed={theme === value} onClick={() => setTheme(value)}><span />{value}{theme === value && <span className="theme-check">✓</span>}</button>)}</div></fieldset>
        <p className="panel-footnote">Your changes are saved automatically on this device.</p>
      </section>
    </Dialog>
    <Dialog open={panel === 'about'} onClose={closePanel} label="About Mind Chill"><section className="about-content glass-card"><Leaf size={28} /><h2 className="about-title">A little room for you.</h2><p>Music, a cozy view, and one thing to focus on. Mind Chill is your quiet companion for work, study, and unwinding.</p><div className="shortcuts-grid">{[['Space','Play / pause'],['G','Next scene'],['M','Mute'],['P','Focus timer'],['T','Your tasks'],['F','Fullscreen']].map(([key,label]) => <div className="shortcut-item" key={key}><kbd>{key}</kbd><span>{label}</span></div>)}</div><p className="about-credit">Made with care by Sijan Pradhan · <a href="https://github.com/Sij4n/MindChill" target="_blank" rel="noreferrer">GitHub ↗</a></p></section></Dialog>
    <VideoCall isOpen={panel === 'study'} onClose={closePanel} />
    {isPromoMode && <PromoVideo onComplete={() => {window.location.href = '/';}} />}
  </div>;
}
export default App;
