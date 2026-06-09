function StatsCards({ totalAnalyses, recentAnalysis }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">Total Analyses</span>
        <h2>{totalAnalyses}</h2>
      </div>
      <div className="stat-card">
        <span className="stat-label">Latest Sentiment</span>
        <h2>{recentAnalysis?.sentiment || 'N/A'}</h2>
      </div>
      <div className="stat-card">
        <span className="stat-label">Latest Issues</span>
        <h2>{recentAnalysis?.issues?.length || 0}</h2>
      </div>
      <div className="stat-card">
        <span className="stat-label">Recommendations</span>
        <h2>{recentAnalysis?.recommendations?.length || 0}</h2>
      </div>
    </div>
  );
}

export default StatsCards;
