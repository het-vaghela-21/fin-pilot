import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FiBarChart2, FiBook, FiGrid, FiList, FiTarget, FiUser, FiDollarSign, FiSettings, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import AddTransactionModal from '../components/AddTransactionModal';
import { CoinStack, PiggyBank, CreditCard } from '../components/decorative/FinanceElements';
// GSAP import for animations
import { gsap } from 'gsap';

// Import sidebar styles
import '../components/sidebar.css';

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 dark:from-blue-600 dark:to-blue-700'
      : 'text-gray-700 hover:bg-gray-100/80 hover:translate-x-1 dark:text-gray-200 dark:hover:bg-gray-800/50'
  }`;

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const activeIndicatorRef = useRef(null);
  
  // Get user info from localStorage
  const user = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user')||'null'); } catch { return null; }
  }, []);
  
  // Animation for active nav item indicator
  useEffect(() => {
    const activeLink = document.querySelector('.sidebar-nav-link.active');
    if (activeLink && activeIndicatorRef.current) {
      gsap.to(activeIndicatorRef.current, {
        y: activeLink.offsetTop + activeLink.offsetHeight / 2,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside 
          ref={sidebarRef}
          className={`${collapsed ? 'w-20 sidebar-collapsed' : 'w-72 sidebar-expanded'} shrink-0 border-r bg-white p-5 dark:border-gray-800 dark:bg-gray-950 hidden md:block transition-all duration-300 relative overflow-hidden`}
        >
          {/* Background pattern */}
          <div className="sidebar-pattern"></div>
          {/* Sidebar header with logo */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <span className="text-xl text-blue-600 dark:text-blue-400">✈️</span>
              </div>
              {!collapsed && (
                <div className="ml-3 transition-opacity duration-300">
                  <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Fin-Pilot</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Financial Dashboard</div>
                </div>
              )}
            </div>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {collapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Active indicator dot */}
          <div 
            ref={activeIndicatorRef}
            className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full transform -translate-y-1/2 transition-all duration-300 hidden md:block"
          />
          
          {/* Navigation links */}
          <nav className="space-y-2 relative">
            <NavLink to="/app/dashboard" className={({isActive}) => `sidebar-nav-link ${isActive ? 'active' : ''} ${navLinkClass({isActive})}`} end>
              <div className="icon-container flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <FiGrid className="w-4 h-4" />
              </div>
              {!collapsed && <span className="nav-text transition-all duration-300">Dashboard</span>}
            </NavLink>
            
            <NavLink to="/app/budgets" className={({isActive}) => `sidebar-nav-link ${isActive ? 'active' : ''} ${navLinkClass({isActive})}`}>
              <div className="icon-container flex items-center justify-center w-8 h-8 rounded-lg bg-green-100/50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <FiDollarSign className="w-4 h-4" />
              </div>
              {!collapsed && <span className="nav-text transition-all duration-300">Budgets</span>}
            </NavLink>
            
            <NavLink to="/app/transactions" className={({isActive}) => `sidebar-nav-link ${isActive ? 'active' : ''} ${navLinkClass({isActive})}`}>
              <div className="icon-container flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100/50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                <FiList className="w-4 h-4" />
              </div>
              {!collapsed && <span className="nav-text transition-all duration-300">Transactions</span>}
            </NavLink>
            
            <NavLink to="/app/goals" className={({isActive}) => `sidebar-nav-link ${isActive ? 'active' : ''} ${navLinkClass({isActive})}`}>
              <div className="icon-container flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-100/50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                <FiTarget className="w-4 h-4" />
              </div>
              {!collapsed && <span className="nav-text transition-all duration-300">Goals</span>}
            </NavLink>
            
            <NavLink to="/app/reports" className={({isActive}) => `sidebar-nav-link ${isActive ? 'active' : ''} ${navLinkClass({isActive})}`}>
              <div className="icon-container flex items-center justify-center w-8 h-8 rounded-lg bg-red-100/50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <FiBarChart2 className="w-4 h-4" />
              </div>
              {!collapsed && <span className="nav-text transition-all duration-300">Reports</span>}
            </NavLink>
          </nav>

          {/* User profile section */}
          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
            {!collapsed && (
              <div className="user-profile mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center text-white shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-sm">{user?.name || 'Guest User'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.upiId || 'guest@bank'}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <NavLink to="/app/profile" className={({isActive}) => `sidebar-nav-link ${isActive ? 'active' : ''} ${navLinkClass({isActive})}`}>
                <div className="icon-container flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100/50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400">
                  <FiUser className="w-4 h-4" />
                </div>
                {!collapsed && <span className="nav-text transition-all duration-300">Profile</span>}
              </NavLink>
              
              {!collapsed && (
                <button 
                  onClick={toggle}
                  className="sidebar-toggle p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="coin-stack-bg">
            <CoinStack size="xl" />
          </div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <PiggyBank size="lg" />
          </div>
          
          <div className="absolute top-1/4 left-0 transform -translate-x-1/2 opacity-5 pointer-events-none">
            <CreditCard size="lg" />
          </div>
        </aside>

        {/* Main */}
        <div className="flex w-full flex-col">
          <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <button 
                  className="mr-3 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors md:hidden"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="text-lg font-bold md:hidden bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 flex items-center">
                  <span>Fin-Pilot</span>
                  <span className="ml-1 text-xl">✈️</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggle()}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors hidden sm:block"
                >
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                <button 
                  onClick={() => setOpen(true)} 
                  className="rounded-md bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Transaction
                  </span>
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl p-4 md:p-6">
            <Outlet />
          </main>
          <AddTransactionModal open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
