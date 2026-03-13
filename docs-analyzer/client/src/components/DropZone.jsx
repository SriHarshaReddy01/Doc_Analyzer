import { useRef, useState } from 'react';

export default function DropZone({ onFile, loading }) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const onFileChange = (e) => {
    if (e.target.files[0]) onFile(e.target.files[0]);
    e.target.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <div
      className={`dropzone${dragging ? ' dropzone--active' : ''}${loading ? ' dropzone--loading' : ''}`}
      onClick={() => !loading && fileInputRef.current.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && !loading && fileInputRef.current.click()}
      aria-label="Upload PDF"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        style={{ display: 'none' }}
      />
      {loading ? (
        <div className="spinner-wrapper">
          <div className="spinner" />
          <span>Extracting text…</span>
        </div>
      ) : (
        <>
          <div className="dropzone-icon">📄</div>
          <p className="dropzone-label">
            <strong>Click to upload</strong> or drag &amp; drop a PDF here
          </p>
          <p className="dropzone-hint">Maximum file size: 20 MB</p>
        </>
      )}
    </div>
  );
}
