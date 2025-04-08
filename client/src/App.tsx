import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import StudentPage from './pages/students';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentPage />} />
      </Routes>
    </Router>
    )
  }

export default App;
