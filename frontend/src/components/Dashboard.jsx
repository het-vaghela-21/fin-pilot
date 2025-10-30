// frontend/src/components/Dashboard.jsx

import React from 'react';
import { FiPlus } from 'react-icons/fi';

// This is just the layout. We'll add the chart and data later.
const Dashboard = () => {
  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Welcome back, Tirth!</h1>
        <p className="text-lg text-gray-600">Here's your financial overview for this month.</p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Left Column (Main Content) --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Balance Card */}
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <h3 className="text-sm font-medium text-gray-500">Account Balance</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹ 78,450.12</p>
            </div>
            {/* Monthly Spending Card */}
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <h3 className="text-sm font-medium text-gray-500">Monthly Spending</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹ 22,180.50</p>
            </div>
            {/* Savings Rate Card */}
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <h3 className="text-sm font-medium text-gray-500">Savings Rate</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">18%</p>
            </div>
          </div>

          {/* Predictive Cash Flow Card */}
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Cash Flow</h3>
            {/* Alert */}
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-lg mb-4">
              <p className="font-bold">Low Balance Alert</p>
              <p>Based on your spending habits, your balance is projected to be low around <span className="font-semibold">August 26th</span>.</p>
            </div>
            {/* Chart will go here */}
            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">[Chart Placeholder]</p>
            </div>
          </div>
        </div>

        {/* --- Right Column (Sidebar) --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Add Transaction Button */}
          <button className="flex items-center justify-center w-full p-4 bg-blue-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-blue-700 transition-colors">
            <FiPlus className="w-6 h-6 mr-2" />
            Add Transaction
          </button>

          {/* Smart Insight Card */}
          <div className="p-6 bg-blue-600 text-white rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-2">💡 Smart Insight</h3>
            <p className="text-blue-100 mb-4">You've spent ₹2,800 on Zomato & Swiggy this month, 25% more than your average.</p>
            <button className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
              Create a 'Dining Out' Budget
            </button>
          </div>

          {/* Recent Transactions Card (Placeholder) */}
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            {/* Transactions will be mapped here */}
            <p className="text-gray-500">[Recent Transactions Placeholder]</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;