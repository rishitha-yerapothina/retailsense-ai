import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';
import { useState } from 'react';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<DashboardPage analysisResult={analysisResult} />} />
          <Route path="/upload" element={<UploadPage onAnalysis={setAnalysisResult} />} />
          <Route path="/analysis" element={<AnalysisPage analysisResult={analysisResult} />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
