// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Route component import kiya
import Navbar from './components/navbar/navbar'; // Case matching done
import Dashboard from './pages/Dashboard';
import AddSubscription from './pages/Subscription';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Navbar top par global rahay ga */}
      <Navbar />
      
      <main className="main-content-area">
        <Routes>
          {/* path ki jagah Route tag ka use kiya */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-subscription" element={<AddSubscription />} />
          
          {/* Teesri route Settings ke liye baad me yahan add ho jaye gi */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
