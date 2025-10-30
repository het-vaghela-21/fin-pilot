// frontend/src/components/Sidebar.jsx

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
// --- THIS IS THE FIX ---
import { FiHome, FiDollarSign, FiCreditCard, FiPieChart, FiSettings, FiUser } from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa'; // Import FaPlane from 'react-icons/fa'
// --- END OF FIX ---

const Sidebar = () => {
  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'flex items-center p-3 rounded-lg bg-blue-100 text-blue-600 font-semibold'
      : 'flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors';

  return (
    <div className="flex flex-col h-screen w-64 bg-white shadow-lg border-r border-gray-200 fixed">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        {/* --- THIS IS THE FIX --- */}
        <FaPlane className="w-8 h-8 text-blue-600" /> {/* Use FaPlane here */}
        {/* --- END OF FIX --- */}
        <span className="ml-2 text-2xl font-bold text-gray-800">Fin-Pilot</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink to="/dashboard" className={navLinkClass}>
          <FiHome className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/budgets" className={navLinkClass}>
          <FiDollarSign className="w-5 h-5 mr-3" />
          Budgets
        </NavLink>
        <NavLink to="/transactions" className={navLinkClass}>
          <FiCreditCard className="w-5 h-5 mr-3" />
          Transactions
        </NavLink>
        <NavLink to="/goals" className={navLinkClass}>
          <FiPieChart className="w-5 h-5 mr-3" />
          Goals
        </NavLink>
        <NavLink to="/reports" className={navLinkClass}>
          <FiPieChart className="w-5 h-5 mr-3" />
          Reports
        </NavLink>
      </nav>

      {/* Profile Section at the Bottom */}
      <div className="p-4 border-t border-gray-200">
        <Link to="/profile" className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <FiUser className="w-5 h-5 mr-3" />
          Profile
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;