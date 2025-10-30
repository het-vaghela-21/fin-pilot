// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
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
import MoneyRain from './components/decorative/MoneyRain.jsx';

// GSAP import for animations
import { gsap } from 'gsap';

import './App.css'; // Keep this import, even if it's empty (Vite expects it)

function App() {
  // State to control money rain animation for special events
  const [showMoneyRain, setShowMoneyRain] = useState(false);
  
  // Listen for goal achievement events
  useEffect(() => {
    const handleGoalAchieved = () => {
      setShowMoneyRain(true);
      setTimeout(() => setShowMoneyRain(false), 4000);
    };
    
    window.addEventListener('goal-achieved', handleGoalAchieved);
    return () => window.removeEventListener('goal-achieved', handleGoalAchieved);
  }, []);
  
  // Page transition effect setup
  useEffect(() => {
    // Set up page transitions
    const setupPageTransitions = () => {
      gsap.registerEffect({
        name: "pageTransition",
        effect: (targets, config) => {
          return gsap.fromTo(
            targets,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: config.duration || 0.5, ease: "power2.out" }
          );
        },
        defaults: { duration: 0.5 },
        extendTimeline: true
      });
    };
    
    setupPageTransitions();
  }, []);

  return (
    <ThemeProvider>
      <div className="w-full h-full">
        {/* Money rain effect for celebrations */}
        <MoneyRain active={showMoneyRain} count={40} duration={4000} />
        
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
        
        {/* Finance-themed decorative elements */}
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm">
            Fin-Pilot v1.0
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;