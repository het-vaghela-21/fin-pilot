import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <div className="text-xl font-bold">Fin-Pilot ✈️</div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800">Log in</Link>
          <Link to="/register" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Sign up</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Personal Finance Management System</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Track income and expenses in real time, set goals, build budgets, and visualize your cash flow with beautiful interactive charts.</p>
            <ul className="mt-6 space-y-2 text-gray-700 dark:text-gray-200">
              <li className="">• Real-time transaction graph (green up, red down)</li>
              <li className="">• Budgets by category with quick add</li>
              <li className="">• Goals with progress and dashboard banner</li>
              <li className="">• Rich reports and expenditure pie chart</li>
            </ul>
            <div className="mt-8 flex gap-3">
              <Link to="/login" className="rounded-md bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Let’s get started</Link>
              <Link to="/register" className="rounded-md border px-5 py-3 font-semibold hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800">Create an account</Link>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="h-64 w-full rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
              Your money, clearly in view.
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Fin-Pilot. All rights reserved.
      </footer>
    </div>
  );
}
