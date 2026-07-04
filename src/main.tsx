import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import MatchDetail from './pages/MatchDetail';
import TeamDetail from './pages/TeamDetail';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/team/:teamName" element={<TeamDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);