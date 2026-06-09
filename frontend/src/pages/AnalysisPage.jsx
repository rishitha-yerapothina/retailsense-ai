function AnalysisPage({ analysisResult }) {
  if (!analysisResult) {
    return (
      <div className="page-wrapper">
        <div className="page-header">
          <div>
            <h2>Analysis Summary</h2>
            <p>Run an audio or text analysis to display insights here.</p>
          </div>
        </div>
        <div className="empty-state">No analysis available. Use the Upload page to begin.</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2>Analysis Summary</h2>
          <p>Review transcript, detected issues, sentiment, and recommendations.</p>
        </div>
      </div>
      <div className="analysis-grid">
        <section className="analysis-card">
          <h3>Transcript</h3>
          <p>{analysisResult.transcript}</p>
        </section>
        <section className="analysis-card sentiment-card">
          <h3>Sentiment</h3>
          <div className="sentiment-summary">
            <span className={`sentiment-badge ${analysisResult.sentiment.toLowerCase()}`}>{analysisResult.sentiment}</span>
            <span>Confidence: {analysisResult.confidence}</span>
          </div>
        </section>
        <section className="analysis-card">
          <h3>Speaker Breakdown</h3>
          <strong>Customer</strong>
          <p>{analysisResult.speaker_breakdown.customer}</p>
          <strong>Staff</strong>
          <p>{analysisResult.speaker_breakdown.staff}</p>
        </section>
        <section className="analysis-card">
          <h3>Detected Issues</h3>
          <ul>
            {analysisResult.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </section>
        <section className="analysis-card">
          <h3>Recommendations</h3>
          <ol>
            {analysisResult.recommendations.map((recommendation) => (
              <li key={recommendation}>{recommendation}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

export default AnalysisPage;
