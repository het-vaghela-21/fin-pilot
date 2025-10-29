import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiBarChart2, FiBook, FiGrid, FiList, FiTarget, FiUser } from 'react-icons/fi';
import AddTransactionModal from '../components/AddTransactionModal';

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-blue-600 text-white dark:bg-blue-500'
      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
  }`;

export default function AppLayout() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r bg-white p-4 dark:border-gray-800 dark:bg-gray-950 hidden md:block">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-xl font-semibold">Fin-Pilot ✈️</div>
          </div>
          <nav className="space-y-1">
            <NavLink to="/app/dashboard" className={navLinkClass} end>
              <FiGrid /> <span>Dashboard</span>
            </NavLink>
            <NavLink to="/app/budgets" className={navLinkClass}>
              <FiBook /> <span>Budgets</span>
            </NavLink>
            <NavLink to="/app/transactions" className={navLinkClass}>
              <FiList /> <span>Transactions</span>
            </NavLink>
            <NavLink to="/app/goals" className={navLinkClass}>
              <FiTarget /> <span>Goals</span>
            </NavLink>
            <NavLink to="/app/reports" className={navLinkClass}>
              <FiBarChart2 /> <span>Reports</span>
            </NavLink>
          </nav>

          <div className="mt-auto pt-6">
            <NavLink to="/app/profile" className={navLinkClass}>
              <FiUser /> <span>Profile</span>
            </NavLink>
          </div>
        </aside>

        {/* Main */}
        <div className="flex w-full flex-col">
          <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
              <div className="text-lg font-semibold md:hidden">Fin-Pilot ✈️</div>
              <div className="flex items-center gap-3">
                <button onClick={() => setOpen(true)} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  + Add Transaction
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
