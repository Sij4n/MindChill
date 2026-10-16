import { act, renderHook } from '@testing-library/react';
import useFocusTimer, { localDay } from './useFocusTimer';

beforeEach(() => { localStorage.clear(); jest.useFakeTimers('modern'); });
afterEach(() => { jest.useRealTimers(); });

test('uses a deadline to catch up after time in the background and records completion once', () => {
  const { result } = renderHook(() => useFocusTimer());
  act(() => result.current.changeDuration(1));
  act(() => result.current.toggle());
  act(() => {
    jest.setSystemTime(Date.now() + 65000);
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(result.current.mode).toBe('SHORT_BREAK');
  expect(result.current.timeLeft).toBe(300);
  expect(result.current.isRunning).toBe(false);
  expect(result.current.history).toEqual([{ day: localDay(), minutes: 1 }]);
  act(() => jest.advanceTimersByTime(3000));
  expect(result.current.history).toHaveLength(1);
  expect(JSON.parse(localStorage.getItem('mindchill-focus-history'))).toHaveLength(1);
});

test('paused time is preserved and unfinished sessions do not count toward goals', () => {
  const { result } = renderHook(() => useFocusTimer());
  act(() => result.current.toggle());
  act(() => jest.advanceTimersByTime(10000));
  act(() => result.current.toggle());
  expect(result.current.timeLeft).toBe(1490);
  act(() => jest.advanceTimersByTime(60000));
  expect(result.current.timeLeft).toBe(1490);
  act(() => result.current.reset());
  expect(result.current.timeLeft).toBe(1500);
  expect(result.current.history).toHaveLength(0);
});

test('duration cannot change mid-session and the fourth daily focus session gets a long break', () => {
  localStorage.setItem('mindchill-focus-history', JSON.stringify(Array.from({length:3}, () => ({day:localDay(), minutes:25}))));
  const { result } = renderHook(() => useFocusTimer());
  act(() => result.current.changeDuration(1));
  act(() => result.current.toggle());
  act(() => result.current.changeDuration(50));
  expect(result.current.focusMinutes).toBe(1);
  act(() => jest.advanceTimersByTime(60000));
  expect(result.current.mode).toBe('LONG_BREAK');
  expect(result.current.history).toHaveLength(4);
});
