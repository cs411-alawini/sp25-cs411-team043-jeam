import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TabNavigation from './components/tabs/tabs';
import StudentPage from './pages/students';
import RSOPage from './pages/rsos';
import StatisticsPage from './pages/statistics';
import FindFriendPage from './pages/findafriend';
import YourMatchPage from './pages/matches';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <TabNavigation />
        <Routes>
          <Route path="/rsos" element={<RSOPage />} />
          <Route path="/students" element={<StudentPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route 
            path="/find-friend" 
            element={<FindFriendPage />} 
          />
          <Route path="/your-match" element={<YourMatchPage />} />
          <Route path="/" element={<Navigate to="/rsos" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;