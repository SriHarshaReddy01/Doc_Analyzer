import { useState } from 'react';
import { formatDate } from '../utils/formatDate';

export default function HistoryItem({ item }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li className="history-item history-item--expandable">
      <div className="history-item-row">
        <span className="history-filename">{item.filename}</span>
        <div className="history-item-actions">
          <span className="history-date">{formatDate(item.uploaded_at)}</span>
          {item.extracted_text && (
            <button
              className="history-toggle"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? 'Hide' : 'View'} text
            </button>
          )}
        </div>
      </div>
      {expanded && item.extracted_text && (
        <pre className="history-extracted-text">
          {item.extracted_text || '(No text found)'}
        </pre>
      )}
    </li>
  );
}
