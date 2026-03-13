export default function ExtractedResult({ result }) {
  if (!result) return null;
  return (
    <section className="result-section">
      <div className="result-header">
        <h2>Extracted Text</h2>
        <span className="filename-badge">{result.filename}</span>
      </div>
      <pre className="result-text">{result.text || '(No text found in this PDF)'}</pre>
    </section>
  );
}
