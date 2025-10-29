// frontend/src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login.jsx';
import RegisterPage from './components/Register.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import Budgets from './pages/Budgets.jsx';
import Transactions from './pages/Transactions.jsx';
import Goals from './pages/Goals.jsx';
import Reports from './pages/Reports.jsx';
import Profile from './pages/Profile.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Home from './pages/Home.jsx';
import Admin from './pages/Admin.jsx';
import Forgot from './pages/Forgot.jsx';

import './App.css'; // Keep this import, even if it's empty (Vite expects it)

function App() {
  return (
    <ThemeProvider>
      <div className="w-full h-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/forgot" element={<Forgot />} />

          {/* Authenticated app routes */}
          <Route path="/app" element={<AppLayout />}> 
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="goals" element={<Goals />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;