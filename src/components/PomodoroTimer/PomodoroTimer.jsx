import React from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import useFocusTimer, { MODES, formatTime } from '../../useFocusTimer';
import './PomodoroTimer.css';

export function TimerPanel({ timer }) {
  const progress = (timer.duration - timer.timeLeft) / timer.duration;
  return <section className="pomodoro-timer glass-card">
    <div className="panel-heading"><span className="eyebrow">MAKE A LITTLE SPACE</span><h2>Find your flow</h2><p>One thing at a time is enough.</p></div>
    <div className="mode-tabs">{Object.entries(MODES).map(([key, name]) => <button key={key} className={`mode-tab ${timer.mode === key ? 'active' : ''}`} aria-pressed={timer.mode === key} onClick={() => timer.switchMode(key)}>{name}</button>)}</div>
    <div className="timer-display">
      <svg viewBox="0 0 220 220" className="progress-ring" aria-hidden="true"><circle cx="110" cy="110" r="96" fill="none" stroke="var(--glass-border)" strokeWidth="3" /><circle cx="110" cy="110" r="96" fill="none" stroke="var(--color-accent-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray={Math.PI * 192} strokeDashoffset={Math.PI * 192 * (1 - progress)} transform="rotate(-90 110 110)" /></svg>
      <div className="timer-text"><span className="time">{formatTime(timer.timeLeft)}</span><span className="mode-label">{timer.isRunning ? 'You’re making space' : MODES[timer.mode]}</span></div>
    </div>
    <div className="timer-controls"><button className="primary-action" onClick={timer.toggle}>{timer.isRunning ? <Pause size={16} /> : <Play size={16} />}{timer.isRunning ? 'Pause' : 'Start'}</button><button className="secondary-action" onClick={timer.reset}><RotateCcw size={16} />Reset</button></div>
    <label className="duration-field">Focus length <span><input aria-label="Focus minutes" type="number" min="1" max="120" value={timer.focusMinutes} disabled={timer.isRunning} onChange={e => timer.changeDuration(Number(e.target.value))} /> min</span></label>
    <p className="panel-footnote"><Coffee size={15} /> Short breaks are 5 min. A longer break follows every 4 focus sessions today.</p>
    {timer.notice && <p role="status" className="completion-note">{timer.notice}</p>}
  </section>;
}
function StandaloneTimer() { const timer = useFocusTimer(); return <TimerPanel timer={timer} />; }
export default function PomodoroTimer({ timer }) { return timer ? <TimerPanel timer={timer} /> : <StandaloneTimer />; }
