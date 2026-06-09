import { useEffect, useState } from 'react';
import StatsCards from '../components/StatsCards';
import { getHistory } from '../services/api';

function DashboardPage({ analysisResult }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then((data) => setHistory(data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const latestItem = history?.[0] || analysisResult;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2>RetailSense AI Dashboard</h2>
          <p>Monitor audio analysis, sentiment, and store conversation intelligence.</p>
        </div>
      </div>
      <StatsCards totalAnalyses={history.length} recentAnalysis={latestItem} />
      <section className="action-grid">
        <article className="panel">
          <h3>Live transcript preview</h3>
          <p>{analysisResult?.transcript || 'Upload a conversation to analyze an automatic transcript.'}</p>
        </article>
        <article className="panel">
          <h3>Sentiment snapshot</h3>
          <p>{analysisResult ? `${analysisResult.sentiment} (${analysisResult.confidence})` : 'Start a new analysis to see sentiment scores.'}</p>
        </article>
        <article className="panel">
          <h3>New insights</h3>
          <p>{analysisResult?.issues?.join(', ') || 'Detected issues will appear here after analysis.'}</p>
        </article>
      </section>
      <section className="recent-panel">
        <h3>Recent analyses</h3>
        {loading ? (
          <div className="empty-state">Loading history...</div>
        ) : history.length ? (
          <div className="recent-list">
            {history.slice(0, 4).map((item) => (
              <div key={item.id} className="recent-item">
                <strong>{item.filename}</strong>
                <span>{item.sentiment}</span>
                <small>{new Date(item.timestamp).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No recent analyses available.</div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
