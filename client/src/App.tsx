import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import RSOPage from './pages/rsos';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RSOPage />} />
      </Routes>
    </Router>
    )
  }

export default App;
