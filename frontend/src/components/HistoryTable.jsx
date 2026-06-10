function HistoryTable({ history, onDelete }) {
  return (
    <div className="history-table">
      <div className="history-header">
        <span>Transcript</span>
        <span>Sentiment</span>
        <span>Issues</span>
        <span>When</span>
        <span>Action</span>
      </div>
      {history.length === 0 ? (
        <div className="empty-state">No history found yet.</div>
      ) : (
        history.map((item) => (
          <div key={item.id} className="history-row">
            <span title={item.transcript}>{item.transcript.substring(0, 50)}...</span>
            <span>{item.sentiment}</span>
            <span>{item.issues.join(', ')}</span>
            <span>{new Date(item.timestamp).toLocaleString()}</span>
            <button className="delete-button" onClick={() => onDelete(item.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default HistoryTable;
