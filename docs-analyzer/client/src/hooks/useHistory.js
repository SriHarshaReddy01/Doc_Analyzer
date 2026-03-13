import { useState, useCallback } from 'react';

export function useHistory() {
  const [history, setHistory] = useState([]);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) setHistory(await res.json());
    } catch {
      // history is non-critical, fail silently
    }
  }, []);

  return { history, fetchHistory };
}
