function StatsCards({ history }) {
  // Calculate positive conversations
  const positiveCount = history?.filter((item) => item.sentiment === 'Positive').length || 0;
  
  // Calculate negative conversations
  const negativeCount = history?.filter((item) => item.sentiment === 'Negative').length || 0;
  
  // Find most common issue
  const getMostCommonIssue = () => {
    if (!history || history.length === 0) return 'N/A';
    
    const issueCounts = {};
    history.forEach((item) => {
      if (item.issues && Array.isArray(item.issues)) {
        item.issues.forEach((issue) => {
          issueCounts[issue] = (issueCounts[issue] || 0) + 1;
        });
      }
    });
    
    if (Object.keys(issueCounts).length === 0) return 'No issues';
    
    return Object.entries(issueCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">Total Analyses</span>
        <h2>{history?.length || 0}</h2>
      </div>
      <div className="stat-card">
        <span className="stat-label">Positive Conversations</span>
        <h2 style={{ color: '#10b981' }}>{positiveCount}</h2>
      </div>
      <div className="stat-card">
        <span className="stat-label">Negative Conversations</span>
        <h2 style={{ color: '#ef4444' }}>{negativeCount}</h2>
      </div>
      <div className="stat-card">
        <span className="stat-label">Most Common Issue</span>
        <h3 style={{ margin: '8px 0 0', fontSize: '1rem' }}>{getMostCommonIssue()}</h3>
      </div>
    </div>
  );
}

export default StatsCards;
