import { useState, useRef } from 'react';
import { analyzeAudio, analyzeText } from '../services/api';

function UploadPage({ onAnalysis }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an audio file to upload.');
      return;
    }
    setError('');
    setSuccess('');
    setProgress(0);
    try {
      const analysis = await analyzeAudio(selectedFile, setProgress);
      onAnalysis(analysis);
      setSuccess('Audio analyzed successfully.');
    } catch (err) {
      setError(err.message || 'Upload failed.');
    }
  };

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      setError('Enter transcript text to analyze.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      const analysis = await analyzeText({ transcript: textInput });
      onAnalysis(analysis);
      setSuccess('Text analyzed successfully.');
    } catch (err) {
      setError(err.message || 'Text analysis failed.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2>Upload Audio</h2>
          <p>Drag an audio recording or paste conversation text for analysis.</p>
        </div>
      </div>
      <div className="upload-panel">
        <div
          className="drop-area"
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <p>Drag & drop WAV, MP3, M4A files here</p>
          <button type="button">Select file</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden-input"
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          />
        </div>
        {selectedFile && <div className="file-chip">Selected file: {selectedFile.name}</div>}
        <button className="primary-button" type="button" onClick={handleUpload}>
          Upload and Analyze
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-analysis-panel">
          <h3>Analyze text transcript</h3>
          <textarea value={textInput} onChange={(event) => setTextInput(event.target.value)} placeholder="Paste or type transcript text here." />
          <button className="secondary-button" type="button" onClick={handleTextAnalysis}>
            Analyze Text
          </button>
        </div>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
      </div>
    </div>
  );
}

export default UploadPage;
