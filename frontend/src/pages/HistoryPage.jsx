import { useEffect, useState } from 'react';
import { getHistory, deleteHistory } from '../services/api';
import HistoryTable from '../components/HistoryTable';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || 'Unable to load history.');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteHistory(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete history entry.');
    }
  };

  const filteredHistory = history.filter((entry) => {
    const search = searchTerm.toLowerCase();
    return (
      entry.filename.toLowerCase().includes(search) ||
      entry.sentiment.toLowerCase().includes(search) ||
      entry.issues.some((issue) => issue.toLowerCase().includes(search))
    );
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2>History</h2>
          <p>Search, review, and manage past RetailSense AI analyses.</p>
        </div>
      </div>
      <div className="history-controls">
        <input
          type="text"
          placeholder="Search history by file, sentiment, or issue"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <div className="empty-state">Loading history...</div>
      ) : (
        <HistoryTable history={filteredHistory} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default HistoryPage;
