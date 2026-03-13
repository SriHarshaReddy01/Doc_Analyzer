import { useState, useCallback } from 'react';

export function useExtract(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const extractText = useCallback(async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/extract', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Extraction failed.');
      } else {
        setResult(data);
        onSuccess?.();
      }
    } catch {
      setError('Could not reach the server. Is it running?');
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return { loading, error, result, extractText };
}
