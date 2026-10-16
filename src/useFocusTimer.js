import { useCallback, useEffect, useRef, useState } from 'react';
import useStoredState from './useStoredState';

export const MODES = { WORK: 'Focus', SHORT_BREAK: 'Short break', LONG_BREAK: 'Long break' };
export const localDay = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const formatTime = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export default function useFocusTimer() {
  const [focusMinutes, setFocusMinutes] = useStoredState('mindchill-focus-minutes', 25, v => Number.isInteger(v) && v >= 1 && v <= 120);
  const [history, setHistory] = useStoredState('mindchill-focus-history', [], v => Array.isArray(v) && v.every(x => x && typeof x.day === 'string' && Number.isFinite(x.minutes) && x.minutes > 0));
  const [session, setSession] = useState(() => ({ mode: 'WORK', remaining: focusMinutes * 60, duration: focusMinutes * 60, deadline: null }));
  const [now, setNow] = useState(Date.now());
  const [notice, setNotice] = useState('');
  const completedDeadline = useRef(null);
  const timeLeft = session.deadline ? Math.max(0, Math.ceil((session.deadline - now) / 1000)) : session.remaining;
  const durationFor = useCallback(mode => (mode === 'WORK' ? focusMinutes : mode === 'SHORT_BREAK' ? 5 : 15) * 60, [focusMinutes]);

  useEffect(() => {
    if (!session.deadline) return;
    const tick = () => setNow(Date.now());
    const interval = setInterval(tick, 250);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', tick); };
  }, [session.deadline]);

  useEffect(() => {
    if (!session.deadline || timeLeft > 0 || completedDeadline.current === session.deadline) return;
    completedDeadline.current = session.deadline;
    const work = session.mode === 'WORK';
    const day = localDay();
    const count = history.filter(x => x.day === day).length + 1;
    if (work) setHistory(previous => [...previous, { day, minutes: session.duration / 60 }].slice(-1000));
    const mode = work ? (count % 4 === 0 ? 'LONG_BREAK' : 'SHORT_BREAK') : 'WORK';
    const duration = durationFor(mode);
    setSession({ mode, duration, remaining: duration, deadline: null });
    setNotice(work ? 'A little more done. Take a well-earned break.' : 'Welcome back. Ready for a fresh start?');
  }, [session, timeLeft, history, setHistory, durationFor]);

  const toggle = () => {
    const timestamp = Date.now();
    setNow(timestamp);
    setNotice('');
    setSession(previous => previous.deadline
      ? { ...previous, remaining: Math.max(0, Math.ceil((previous.deadline - timestamp) / 1000)), deadline: null }
      : { ...previous, deadline: timestamp + previous.remaining * 1000 });
  };
  const reset = () => { setNotice(''); setSession(previous => ({ ...previous, remaining: previous.duration, deadline: null })); };
  const switchMode = mode => {
    const duration = durationFor(mode);
    setNotice('');
    setSession({ mode, remaining: duration, duration, deadline: null });
  };
  const changeDuration = minutes => {
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120 || session.deadline) return;
    setFocusMinutes(minutes);
    if (session.mode === 'WORK') setSession({ mode: 'WORK', remaining: minutes * 60, duration: minutes * 60, deadline: null });
  };
  return { ...session, timeLeft, isRunning: !!session.deadline, focusMinutes, history, notice, toggle, reset, switchMode, changeDuration };
}
