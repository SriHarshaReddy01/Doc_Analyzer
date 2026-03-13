import { useEffect } from 'react';
import './App.css';
import DropZone from './components/DropZone';
import ExtractedResult from './components/ExtractedResult';
import HistoryList from './components/HistoryList';
import { useHistory } from './hooks/useHistory';
import { useExtract } from './hooks/useExtract';

export default function App() {
  const { history, fetchHistory } = useHistory();
  const { loading, error, result, extractText } = useExtract(fetchHistory);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>PDF Text Extractor</h1>
        <p>Upload a PDF to extract its text content</p>
      </header>

      <main>
        <DropZone onFile={extractText} loading={loading} />

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        <ExtractedResult result={result} />
        <HistoryList history={history} />
      </main>
    </div>
  );
}
