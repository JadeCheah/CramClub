import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThreadsPage from './pages/ThreadsPage';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ThreadsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
