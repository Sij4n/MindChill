import { useEffect, useState } from 'react';

// Preferences remain optional when storage is blocked or contains invalid data.
export default function useStoredState(key, fallback, validate = () => true, migrate = value => value) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const saved = migrate(JSON.parse(raw));
      return validate(saved) ? saved : fallback;
    } catch { return fallback; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled. */ }
  }, [key, value]);
  return [value, setValue];
}
