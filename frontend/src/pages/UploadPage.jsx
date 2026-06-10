import { useState, useRef, useEffect } from 'react';
import { analyzeText } from '../services/api';

function UploadPage({ onAnalysis }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech Recognition API is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.language = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setError('');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript((prev) => (finalTranscript ? prev + finalTranscript : interimTranscript || prev));
    };

    recognition.onerror = (event) => {
      if (event.error === 'network') {
        setError('Network error. Please check your internet connection.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please enable microphone permissions.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    recognitionRef.current = recognition;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartRecording = () => {
    if (!recognitionRef.current) {
      setError('Speech Recognition API is not supported in your browser.');
      return;
    }

    try {
      setTranscript('');
      setRecordingTime(0);
      setAnalysisResult(null);
      setError('');
      setSuccess('');

      recognitionRef.current.start();

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Failed to start recording. Please try again.');
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleAnalyzeTranscript = async () => {
    if (!transcript.trim()) {
      setError('Please record a conversation first.');
      return;
    }

    setError('');
    setSuccess('');
    setIsAnalyzing(true);

    try {
      const analysis = await analyzeText({ transcript });
      setAnalysisResult(analysis);
      onAnalysis(analysis);
      setSuccess('Transcript analyzed successfully!');
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2>Retail Voice Analysis</h2>
          <p>Record a customer conversation for real-time analysis.</p>
        </div>
      </div>

      <div className="upload-panel microphone-panel">
        {/* Microphone Recording Section */}
        <section className="recording-section">
          <div className="recording-controls">
            {!isRecording ? (
              <button
                className="primary-button start-button"
                onClick={handleStartRecording}
                type="button"
              >
                <span className="mic-icon">🎤</span>
                Start Recording
              </button>
            ) : (
              <>
                <div className="recording-status">
                  <div className="pulse-animation"></div>
                  <span>Recording...</span>
                </div>
                <button
                  className="danger-button stop-button"
                  onClick={handleStopRecording}
                  type="button"
                >
                  Stop Recording
                </button>
              </>
            )}
            {isRecording && (
              <div className="recording-timer">
                <span className="timer">{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>

          {/* Live Transcript Area */}
          {transcript && (
            <div className="transcript-section">
              <h3>Live Transcript</h3>
              <div className="transcript-display">
                <p>{transcript}</p>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          {transcript && !isRecording && (
            <button
              className="primary-button analyze-button"
              onClick={handleAnalyzeTranscript}
              disabled={isAnalyzing}
              type="button"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Transcript'}
            </button>
          )}
        </section>

        {/* Analysis Results */}
        {analysisResult && (
          <section className="results-section">
            <h3>Analysis Results</h3>
            
            <div className="result-item">
              <span className="result-label">Sentiment</span>
              <p className={`sentiment sentiment-${analysisResult.sentiment.toLowerCase()}`}>
                {analysisResult.sentiment} ({(analysisResult.confidence * 100).toFixed(1)}%)
              </p>
            </div>

            <div className="result-item">
              <span className="result-label">Detected Issues</span>
              {analysisResult.issues && analysisResult.issues.length > 0 ? (
                <ul className="issues-list">
                  {analysisResult.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              ) : (
                <p>No issues detected.</p>
              )}
            </div>

            <div className="result-item">
              <span className="result-label">Recommendations</span>
              {analysisResult.recommendations && analysisResult.recommendations.length > 0 ? (
                <ul className="recommendations-list">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              ) : (
                <p>No recommendations.</p>
              )}
            </div>

            <div className="result-item">
              <span className="result-label">Timestamp</span>
              <p>{new Date(analysisResult.timestamp).toLocaleString()}</p>
            </div>
          </section>
        )}

        {/* Alerts */}
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
      </div>

      <style>{`
        .microphone-panel {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .recording-section {
          background: white;
          border-radius: 12px;
          padding: 28px;
          border: 2px solid #e5e7eb;
        }

        .recording-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .start-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 1.1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .start-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }

        .stop-button {
          padding: 12px 24px;
          font-size: 1.1rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .stop-button:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .recording-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #ef4444;
        }

        .pulse-animation {
          width: 12px;
          height: 12px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        .recording-timer {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.2rem;
          font-weight: 700;
          color: #1f2937;
          background: #f3f4f6;
          padding: 8px 16px;
          border-radius: 8px;
        }

        .timer {
          font-family: 'Courier New', monospace;
        }

        .transcript-section {
          background: #f9fafb;
          border-radius: 12px;
          padding: 16px;
          border-left: 4px solid #667eea;
        }

        .transcript-section h3 {
          margin: 0 0 12px 0;
          color: #1f2937;
          font-size: 1rem;
        }

        .transcript-display {
          background: white;
          border-radius: 8px;
          padding: 16px;
          min-height: 80px;
          border: 1px solid #e5e7eb;
          max-height: 300px;
          overflow-y: auto;
        }

        .transcript-display p {
          margin: 0;
          line-height: 1.6;
          color: #374151;
        }

        .analyze-button {
          width: 100%;
          padding: 14px;
          font-size: 1.1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .analyze-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }

        .analyze-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .results-section {
          background: white;
          border-radius: 12px;
          padding: 28px;
          border: 2px solid #e5e7eb;
        }

        .results-section h3 {
          margin: 0 0 20px 0;
          color: #1f2937;
          font-size: 1.3rem;
        }

        .result-item {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .result-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .result-label {
          display: block;
          font-weight: 600;
          color: #6b7280;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .sentiment {
          font-size: 1.2rem;
          font-weight: 700;
          padding: 8px 12px;
          border-radius: 6px;
          display: inline-block;
        }

        .sentiment-positive {
          color: #10b981;
          background: #ecfdf5;
        }

        .sentiment-negative {
          color: #ef4444;
          background: #fef2f2;
        }

        .sentiment-neutral {
          color: #f59e0b;
          background: #fffbf0;
        }

        .issues-list,
        .recommendations-list {
          margin: 0;
          padding-left: 20px;
        }

        .issues-list li,
        .recommendations-list li {
          margin: 8px 0;
          color: #374151;
          line-height: 1.6;
        }

        .alert {
          padding: 14px 16px;
          border-radius: 8px;
          font-size: 1rem;
          margin-top: 16px;
        }

        .alert.error {
          background: #fee2e2;
          color: #991b1b;
          border-left: 4px solid #ef4444;
        }

        .alert.success {
          background: #ecfdf5;
          color: #065f46;
          border-left: 4px solid #10b981;
        }

        .mic-icon {
          font-size: 1.5rem;
        }

        .primary-button,
        .secondary-button,
        .danger-button {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}

export default UploadPage;
