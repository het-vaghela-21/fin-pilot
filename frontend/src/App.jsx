// frontend/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import LoginPage from './components/Login.jsx'; // Correct path for Login
import RegisterPage from './components/Register.jsx';
// import RegisterPage from './components/Register.jsx'; // We'll create this next
// import DashboardPage from './pages/Dashboard.jsx'; // For future use

import './App.css'; // Keep this import, even if it's empty (Vite expects it)

function App() {
  return (
    // The main App div doesn't need centering classes now, as the 'body' handles it.
    // It will just contain our routed components.
    <div className="w-full h-full flex items-center justify-center"> {/* Occupy full space for centered content */}
      <Routes>
        {/* Default route to Login page */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route for the Register page (will be created in next step) */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Future Dashboard route */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;