// frontend/src/components/DashboardLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      {/* Main Content Area */}
      <main className="flex-1 ml-64 overflow-y-auto">
        {/* ml-64 matches the sidebar width */}
        <div className="p-8">
          <Outlet /> {/* This will render the specific page, e.g., Dashboard.jsx */}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;